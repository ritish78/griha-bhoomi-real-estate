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
const express_1 = require("express");
const authSchema_1 = require("src/controller/auth/authSchema");
const authController_1 = require("src/controller/auth/authController");
const validateRequest_1 = require("src/middleware/validateRequest");
const authCheck_1 = require("src/middleware/authCheck");
const error_1 = require("src/utils/error");
const logger_1 = __importDefault(require("src/utils/logger"));
const router = (0, express_1.Router)();
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
 */
router
    .route("/register")
    .post((0, validateRequest_1.validateRequest)(authSchema_1.registerSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //First, we destructure the request body to get the fields submitted by user
        const { firstName, lastName, email, password, confirmPassword, phone, dob } = req.body;
        console.log(firstName, email, dob);
        //Calling registerUser controller which is responsible for doing checks
        //and if all conditions is satisfied, then a new account is created.
        yield (0, authController_1.registerUser)(firstName, lastName, email, password.trim(), confirmPassword.trim(), phone, dob);
        //In the registerUser() controller, we throw BadRequestError if the
        //request does not satisfy our requirement. If no error is thrown
        //then a new account is created sucessfully.
        return res.status(201).send({ message: "Signup successful. New account created!" });
    }
    catch (error) {
        next(error);
    }
}));
router.route("/register").get((req, res) => {
    return res.status(200).send({ message: "Register Page!" });
});
/**
 * @route       /api/v1/auth/login
 * @method      POST
 * @desc        Login user who already have account
 * @access      Public
 */
router
    .route("/login")
    .post((0, validateRequest_1.validateRequest)(authSchema_1.loginSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Like in register route, we first destructure the body to get the required fields
        const { email, password, test } = req.body;
        console.log({ email, password, test });
        //Calling authUser controller which is responsible for doing checks
        //and if the user exists, we get the user back with their details
        const userByEmail = yield (0, authController_1.authUser)(email, password);
        //If the user does not exists, the authUser controller thows
        //AuthError with message "Invalid Credentials!"
        //It will throw the same error with same message if the password
        //supplied by user and the hashed password in database don't match
        //Now, we can create session token and store it in cookies
        //TypeScript throws error in `userId`. Solved using this:
        //https://stackoverflow.com/questions/65108033/property-user-does-not-exist-on-type-session-partialsessiondata
        req.session.userId = userByEmail.id;
        req.session.email = userByEmail.email;
        req.session.save();
        return res.status(200).send({ message: "Login Successful!" });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route       /api/v1/auth/logout
 * @method      POST
 * @desc        Logout the user by removing the session from the store
 * @access      Public
 */
router.route("/logout").post(authCheck_1.onlyIfLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((error) => {
        if (error) {
            logger_1.default.debug("Failed to logout user in logout endpoint", { req, error }, true);
            throw new error_1.BadRequestError("Could not logout the user!");
        }
        else {
            res.clearCookie("connect.sid");
            return res.status(200).send({ message: "Logged out sucessfully!" });
            // res.redirect("/");
        }
    });
}));
exports.default = router;
