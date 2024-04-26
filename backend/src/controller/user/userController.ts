import hashPassword from "src/utils/hashPassword";

import logger from "src/utils/logger";

import { NUMBER_OF_SALT_ROUNDS } from "src/config";
import { User, user } from "src/model/user";
import db from "src/db";
import { eq } from "drizzle-orm";
import { preparedGetUserById } from "src/db/preparedStatement";
import { AuthError } from "src/utils/error";

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
export const updateUser = async (userId: string, updateFields) => {
  logger.info(`Updating user of id: ${userId}`);

  //Destructuring the user fields from req.body that was passed from api handler
  const { firstName, lastName, password, confirmPassword, phone, dob, bio, secondEmail, profilePicUrl } =
    updateFields;

  //First let's check if the user exists or not. The user should exists as we use the
  //`onlyIfLoggedIn` middleware to check if the valid token is received by the server
  const [userById] = await preparedGetUserById.execute({ userId });
  if (!userById) {
    throw new AuthError("Please login to perform this action!");
  }

  const userFieldsToUpdate: Partial<User> = {};
  userFieldsToUpdate.updatedAt = new Date();

  if (firstName) userFieldsToUpdate.firstName = firstName;
  if (lastName) userFieldsToUpdate.lastName = lastName;
  if (phone) userFieldsToUpdate.phone = phone;
  if (dob) userFieldsToUpdate.dob = dob;
  if (bio) userFieldsToUpdate.bio = bio;
  if (secondEmail) userFieldsToUpdate.secondEmail = secondEmail;
  if (profilePicUrl) userFieldsToUpdate.profilePicUrl = profilePicUrl;

  if (password && confirmPassword && password.trim() === confirmPassword.trim()) {
    const hashedPassword = await hashPassword(password.trim(), NUMBER_OF_SALT_ROUNDS);
    userFieldsToUpdate.password = hashedPassword;
  }

  await db.update(user).set(userFieldsToUpdate).where(eq(user.id, userId));

  logger.info(`Updated user detail of user id: ${userId}`, userFieldsToUpdate, true);
};
