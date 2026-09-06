"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const config_1 = require("src/config");
const logger_1 = __importDefault(require("src/utils/logger"));
//reconnecting to redis incase connection is broken
const reconn_strategy = (retries) => {
    if (retries > config_1.REDIS_MAX_CONNECTION_RETRY) {
        logger_1.default.error("Too many retries to connect to Redis. Connection closed!");
        return new Error("Too many retries! Could not connect to Redis!");
    }
    else {
        const wait = Math.min(config_1.REDIS_MIN_CONNECTION_DELAY_IN_MS * Math.pow(2, retries), config_1.REDIS_MAX_CONNECTION_DELAY_IN_MS);
        logger_1.default.info(`waiting ${wait} milliseconds`);
        return wait;
    }
};
//Then we can create redis client which can interact with redis
const redisClient = config_1.REDIS_URL || process.env.NODE_ENV === "production"
    ? (0, redis_1.createClient)({ url: config_1.REDIS_URL })
    : (0, redis_1.createClient)({
        socket: {
            host: config_1.REDIS_HOST,
            port: config_1.REDIS_PORT,
            reconnectStrategy: reconn_strategy
        }
    });
redisClient.on("connect", () => {
    console.log("Connected to Redis!");
});
exports.default = redisClient;
