import { Router } from "express";

import { registerSchema, loginSchema } from "src/controller/auth/authSchema";

import { registerUser, authUser } from "src/controller/auth/authController";
import { validateRequest } from "src/middleware/validateRequest";

const router = Router();

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

router.route("/register").post(validateRequest(registerSchema), async (req, res, next) => {
  try {
    //First, we destructure the request body to get the fields submitted by user
    const { firstName, lastName, email, password, confirmPassword, phone, dob } = req.body;
    console.log(firstName, email, dob);
    //Calling registerUser controller which is responsible for doing checks
    //and if all conditions is satisfied, then a new account is created.
    await registerUser(firstName, lastName, email, password.trim(), confirmPassword.trim(), phone, dob);

    //In the registerUser() controller, we throw BadRequestError if the
    //request does not satisfy our requirement. If no error is thrown
    //then a new account is created sucessfully.
    return res.status(201).send({ message: "Signup successful. New account created!" });
  } catch (error) {
    next(error);
  }
});

router.route("/register").get((req, res) => {
  return res.status(200).send({ message: "Register Page!" });
});

/**
 * @route       /api/v1/auth/login
 * @method      POST
 * @desc        Login user who already have account
 * @access      Public
 */
router.route("/login").post(validateRequest(loginSchema), async (req, res, next) => {
  try {
    //Like in register route, we first destructure the body to get the required fields
    const { email, password } = req.body;
    console.log({ email, password });

    //Calling authUser controller which is responsible for doing checks
    //and if the user exists, we get the user back with their details
    const userByEmail = await authUser(email, password);

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
  } catch (error) {
    next(error);
  }
});

export default router;
