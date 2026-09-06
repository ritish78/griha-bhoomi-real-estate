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
exports.isAdmin = void 0;
const preparedStatement_1 = require("src/db/preparedStatement");
/**
 * @param userId  string - id of the user to verify if the user is admin or not
 * @returns       boolean - true if the user is an ADMIN or MODERATOR
 */
const isAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [userById] = yield preparedStatement_1.preparedGetUserById.execute({ userId });
    return userById.isAdmin || userById.role === "ADMIN" || userById.role === "MODERATOR";
});
exports.isAdmin = isAdmin;
