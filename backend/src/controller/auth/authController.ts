import bcrypt from "bcrypt";

import { preparedGetUserByEmail, preparedGetUserById, preparedInsertUser } from "src/db/preparedStatement";

import hashPassword from "src/utils/hashPassword";
import { AuthError, BadRequestError } from "src/utils/error";
import logger from "src/utils/logger";

import { NUMBER_OF_SALT_ROUNDS } from "src/config";
import { SessionData } from "express-session";

/**
 * First, we make a function that retrieves user from the database.
 * We can use that function in auth and registering
 */
export const getUserByEmail = async (email: string) => {
  //Drizzle returns the result in the array even if we have set the limit of just 1 return
  //So, we destructure the array to get the user.
  console.log("Getting user of email:", email);
  //Using prepared statement to get the user by email
  //Reference: https://orm.drizzle.team/docs/perf-queries
  //https://orm.drizzle.team/docs/rqb#prepared-statements
  const [userFromDatabase] = await preparedGetUserByEmail.execute({ email });
  console.log("User: ", userFromDatabase);
  return userFromDatabase;
};

export const getUserById = async (userId: string) => {
  const [userFromDatabase] = await preparedGetUserById.execute({ userId });

  return userFromDatabase;
};

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

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  phone: string,
  dob: string
) => {
  //First let's check if the supplied password and confirmPassword matches
  console.log("Registering User!");
  if (password !== confirmPassword) {
    throw new BadRequestError("Mismatched Password!");
  }
  logger.info("Fetching User by email");
  //Then, we check if an account of the supplied email already exists in our database
  const userFromDatabase = await getUserByEmail(email);

  //If user already requests, we throw error as one user should not be able
  //to signup more than once
  if (userFromDatabase) {
    throw new BadRequestError("User already exists! Login instead!");
  }

  console.log("Hashing password");
  //By default, hashPassword() function salts 10 times even if we don't specify the second parameter.
  const hashedPassword = await hashPassword(password, NUMBER_OF_SALT_ROUNDS);

  logger.info(`Adding User of email ${email}`);
  // Finally, storing the new user in the database! Yay!, new user.
  await preparedInsertUser.execute({
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
};

/**
 * @route             /api/v1/auth/login
 * @method            POST
 * @desc              Authenticate user
 * @access            Public
 * @param email       string - email of the user
 * @param password    string - password of the user in plain text
 * @returns           User Object
 */
export const authUser = async (email: string, password: string) => {
  const userFromDatabase = await getUserByEmail(email);

  //If user from supplied email does not exists, we throw an error.
  if (!userFromDatabase) {
    throw new AuthError("Invalid Credentials!");
  }

  //Then we compare the hash of password provided by user to the hashed password stored in database
  const passwordMatches = await bcrypt.compare(password, userFromDatabase.password);

  if (!passwordMatches) {
    throw new AuthError("Invalid Credentials!");
  }

  //If the checks of email and password is satisfied, we return the user that we selected from database
  return userFromDatabase;
};

