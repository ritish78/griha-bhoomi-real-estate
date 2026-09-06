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
const express_1 = require("express");
const userController_1 = require("src/controller/user/userController");
const userSchema_1 = require("src/controller/user/userSchema");
const authCheck_1 = require("src/middleware/authCheck");
const validateRequest_1 = require("src/middleware/validateRequest");
const router = (0, express_1.Router)();
/**
 * @route                   /api/v1/user/update
 * @method                  POST
 * @desc                    Register new user
 * @access                  Public
 * @param firstName         string - firstName of user
 * @param lastName          string - lastName of user
 * @param password          string - password of user in plain text
 * @param confirmPassword   string - confirmPassword of user in plain text
 * @param phone             string - phone number in string
 * @param dob               string - date of birth in string
 * @param bio               string - bio of the user
 * @param secondEmail       string - second email of user
 * @param profilePicUrl     string - url of the picture to set as profile pic
 */
router
    .route("/update")
    .post(authCheck_1.onlyIfLoggedIn, (0, validateRequest_1.validateRequest)(userSchema_1.updateUserSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.session.userId;
        yield (0, userController_1.updateUser)(currentUserId, req.body);
        return res.status(200).send({ message: `User of id ${currentUserId} updated sucessfully!` });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
