"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("src/db/redis"));
const error_1 = require("src/utils/error");
const config_1 = require("../config");
const logger_1 = __importDefault(require("src/utils/logger"));
/**
 * @param req     Request object from express
 * @param res     Response object from express
 * @param next    Next middleware function from express
 * @returns       next() and sets header "X-Rate-Limit": TTL
 * @throws        RateLimitError
 */
const rateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let ttl;
    //If the request is sent by logged in user
    if (req.session.userId) {
        const numberOfRequestByAuthorizedUser = yield redis_1.default.incr(req.session.userId);
        //If it is their first visit
        if (numberOfRequestByAuthorizedUser === 1) {
            //We set their userid as key and that key will expire in specified amount of seconds
            yield redis_1.default.expire(req.session.userId, config_1.WINDOW_SIZE_IN_SECONDS);
            ttl = config_1.WINDOW_SIZE_IN_SECONDS;
        }
        else {
            ttl = yield redis_1.default.ttl(req.session.userId);
        }
        res.setHeader("X-RateLimit-TTL", ttl);
        res.setHeader("X-RateLimit-Remaining", config_1.MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE - numberOfRequestByAuthorizedUser);
        //If the number of requests made by the user is higher than we have set
        //we rate limit them and throw RateLimitError.
        //We could also implement another logic where we store how many
        //times a user has reached rate limit. Let's say a user has got rate
        //limit error 10 times in the past 14 days, then we can ban the account
        //We might need to store that analytics in a different database
        if (numberOfRequestByAuthorizedUser >= config_1.MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE) {
            logger_1.default.debug(`Rate limited for user of id ${req.session.id}`, { id: req.session.id, ttl, ip: req.socket.remoteAddress }, true);
            next(new error_1.RateLimitError("Too many requests! Rate Limit Exceeded!"));
        }
        else {
            next();
        }
    }
    else {
        //If the request is sent by user that isn't logged in
        //We use their IP address as key to store their number of
        //requests made as key in redis
        //If we are using reverse-proxy like `nginx` then we should
        //use `app.set('trust proxy')` in express to get the IP
        //Then we can use `req.ip` to get the IP of the user.
        //Source: https://expressjs.com/en/guide/behind-proxies.html
        //Cloudflare sets `X-Forwarded-For` header for every requests.
        //So, we need to use `req.headers["X-Forwarded-For"]` to get the IP
        //Source: https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/
        //Also see MDN Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
        //In short, it might be best if we use `express-rate-limit` and `rate-limit-redis`
        //library to rate limit as we already use Redis but it will need installing
        //another two dependency for rate limiting user.
        const clientIP = req.socket.remoteAddress;
        if (clientIP) {
            const numberOfRequestByNotLoggedInUser = yield redis_1.default.incr(clientIP);
            //If it is their first visit
            if (numberOfRequestByNotLoggedInUser === 1) {
                yield redis_1.default.expire(clientIP, config_1.WINDOW_SIZE_IN_SECONDS);
                ttl = config_1.WINDOW_SIZE_IN_SECONDS;
            }
            else {
                ttl = yield redis_1.default.ttl(clientIP);
            }
            res.setHeader("X-RateLimit-TTL", ttl);
            res.setHeader("X-RateLimit-Remaining", config_1.MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE - numberOfRequestByNotLoggedInUser);
            if (numberOfRequestByNotLoggedInUser >= config_1.MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE) {
                logger_1.default.debug(`Rate limited for user of not logged in user!`, { ip: req.socket.remoteAddress, ttl }, true);
                next(new error_1.RateLimitError("Rate Limit Exceeded! Login to use more!"));
            }
            else {
                next();
            }
        }
        else {
            logger_1.default.info("Request made by user who isn't logged in and could not identify their IP address. Check if the request is from localhost!", clientIP, true);
        }
    }
});
exports.default = rateLimiter;
