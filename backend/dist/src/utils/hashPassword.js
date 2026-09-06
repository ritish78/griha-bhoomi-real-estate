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
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * @param plainPassword   string: plain password to hash
 * @param saltRounds      number: salt rounds, default = 10
 * @returns               string: hashed password using bcrypt
 */
const hashPassword = (plainPassword_1, ...args_1) => __awaiter(void 0, [plainPassword_1, ...args_1], void 0, function* (plainPassword, saltRounds = 10) {
    //We use bcrypt to hash the password
    //Salt Rounds is the cost factor to calculate a single bcrypt hash
    //More salt rounds require more processing power and provide more security
    const salt = yield bcrypt_1.default.genSalt(saltRounds);
    const hashedPassword = yield bcrypt_1.default.hash(plainPassword, salt);
    return hashedPassword;
});
exports.default = hashPassword;
