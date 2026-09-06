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
exports.authUser = exports.registerUser = exports.getUserById = exports.getUserByEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const preparedStatement_1 = require("src/db/preparedStatement");
const hashPassword_1 = __importDefault(require("src/utils/hashPassword"));
const error_1 = require("src/utils/error");
const logger_1 = __importDefault(require("src/utils/logger"));
const config_1 = require("src/config");
/**
 * First, we make a function that retrieves user from the database.
 * We can use that function in auth and registering
 */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    //Drizzle returns the result in the array even if we have set the limit of just 1 return
    //So, we destructure the array to get the user.
    console.log("Getting user of email:", email);
    //Using prepared statement to get the user by email
    //Reference: https://orm.drizzle.team/docs/perf-queries
    //https://orm.drizzle.team/docs/rqb#prepared-statements
    const [userFromDatabase] = yield preparedStatement_1.preparedGetUserByEmail.execute({ email });
    console.log("User: ", userFromDatabase);
    return userFromDatabase;
});
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [userFromDatabase] = yield preparedStatement_1.preparedGetUserById.execute({ id });
    return userFromDatabase;
});
exports.getUserById = getUserById;
/**
 * @route                 /api/v1/auth/register
 * @method                POST
 * @desc                  Register new user
 * @access                Public
 * @param firstName       string - firstName of user
 * @param lastName        string - lastName of user
 * @param email           string - email of user
 * @param password        string - password of user in plain text
 * @param confirmPassword string - confirmPassword of user in plain text
 * @param phone           string - phone number in string
 * @param dob             string - date of birth in string
 * @returns               void
 */
const registerUser = (firstName, lastName, email, password, confirmPassword, phone, dob) => __awaiter(void 0, void 0, void 0, function* () {
    //First let's check if the supplied password and confirmPassword matches
    console.log("Registering User!");
    if (password !== confirmPassword) {
        throw new error_1.BadRequestError("Mismatched Password!");
    }
    logger_1.default.info("Fetching User by email");
    //Then, we check if an account of the supplied email already exists in our database
    const userFromDatabase = yield (0, exports.getUserByEmail)(email);
    //If user already requests, we throw error as one user should not be able
    //to signup more than once
    if (userFromDatabase) {
        throw new error_1.BadRequestError("User already exists! Login instead!");
    }
    console.log("Hashing password");
    //By default, hashPassword() function salts 10 times even if we don't specify the second parameter.
    const hashedPassword = yield (0, hashPassword_1.default)(password, config_1.NUMBER_OF_SALT_ROUNDS);
    logger_1.default.info(`Adding User of email ${email}`);
    // Finally, storing the new user in the database! Yay!, new user.
    yield preparedStatement_1.preparedInsertUser.execute({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        dob,
        bio: "",
        profilePicUrl: "",
        secondEmail: "",
        enabled: true,
        verified: false,
        isAdmin: false,
        isAgent: false,
        role: "VIEWER"
    });
});
exports.registerUser = registerUser;
/**
 * @route             /api/v1/auth/login
 * @method            POST
 * @desc              Authenticate user
 * @access            Public
 * @param email       string - email of the user
 * @param password    string - password of the user in plain text
 * @returns           User Object
 */
const authUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userFromDatabase = yield (0, exports.getUserByEmail)(email);
    //If user from supplied email does not exists, we throw an error.
    if (!userFromDatabase) {
        throw new error_1.AuthError("Invalid Credentials!");
    }
    //Then we compare the hash of password provided by user to the hashed password stored in database
    const passwordMatches = yield bcrypt_1.default.compare(password, userFromDatabase.password);
    if (!passwordMatches) {
        throw new error_1.AuthError("Invalid Credentials!");
    }
    //If the checks of email and password is satisfied, we return the user that we selected from database
    return userFromDatabase;
});
exports.authUser = authUser;
