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
exports.updateUser = void 0;
const hashPassword_1 = __importDefault(require("src/utils/hashPassword"));
const logger_1 = __importDefault(require("src/utils/logger"));
const config_1 = require("src/config");
const user_1 = require("src/model/user");
const db_1 = __importDefault(require("src/db"));
const drizzle_orm_1 = require("drizzle-orm");
const preparedStatement_1 = require("src/db/preparedStatement");
const error_1 = require("src/utils/error");
/**
 * @route                       /api/v1/user/update
 * @method                      POST
 * @desc                        Update the current user
 * @access                      Private
 * @info All of the params below are in an object received on request body `req.body`
 * @param firstName             string - firstName of user
 * @param lastName              string - lastName of user
 * @param password              string - password of user in plain text
 * @param confirmPassword       string - confirmPassword of user in plain text
 * @param phone                 string - phone number in string
 * @param dob                   string - date of birth in string
 * @param bio                   string - bio of the user
 * @param secondEmail           string - second email of user
 * @param profilePicUrl         string - url of the picture to set as profile
 * @returns                     void
 */
const updateUser = (userId, updateFields) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Updating user of id: ${userId}`);
    //Destructuring the user fields from req.body that was passed from api handler
    const { firstName, lastName, password, confirmPassword, phone, dob, bio, secondEmail, profilePicUrl } = updateFields;
    //First let's check if the user exists or not. The user should exists as we use the
    //`onlyIfLoggedIn` middleware to check if the valid token is received by the server
    const [userById] = yield preparedStatement_1.preparedGetUserById.execute({ userId });
    if (!userById) {
        throw new error_1.AuthError("Please login to perform this action!");
    }
    const userFieldsToUpdate = {};
    userFieldsToUpdate.updatedAt = new Date();
    if (firstName)
        userFieldsToUpdate.firstName = firstName;
    if (lastName)
        userFieldsToUpdate.lastName = lastName;
    if (phone)
        userFieldsToUpdate.phone = phone;
    if (dob)
        userFieldsToUpdate.dob = dob;
    if (bio)
        userFieldsToUpdate.bio = bio;
    if (secondEmail)
        userFieldsToUpdate.secondEmail = secondEmail;
    if (profilePicUrl)
        userFieldsToUpdate.profilePicUrl = profilePicUrl;
    if (password && confirmPassword && password.trim() === confirmPassword.trim()) {
        const hashedPassword = yield (0, hashPassword_1.default)(password.trim(), config_1.NUMBER_OF_SALT_ROUNDS);
        userFieldsToUpdate.password = hashedPassword;
    }
    yield db_1.default.update(user_1.user).set(userFieldsToUpdate).where((0, drizzle_orm_1.eq)(user_1.user.id, userId));
    logger_1.default.info(`Updated user detail of user id: ${userId}`, userFieldsToUpdate, true);
});
exports.updateUser = updateUser;
