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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyIfLoggedIn = void 0;
const error_1 = require("src/utils/error");
/**
 * @param req     Request object from express
 * @param res     Response object from express
 * @param next    Next middleware function from express
 * @returns       void
 * @throws        AuthError
 */
const onlyIfLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //First lets check if the user has session id stored in cookie
    //If the user is not signed in, we throw AuthError
    if (!req.session || !req.session.userId) {
        return next(new error_1.AuthError("Not logged in! Please login to continue"));
    }
    next();
});
exports.onlyIfLoggedIn = onlyIfLoggedIn;
