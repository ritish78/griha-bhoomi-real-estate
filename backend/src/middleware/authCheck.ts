import { Request, Response, NextFunction } from "express";
import { AuthError } from "src/utils/error";

/**
 * @param req     Request object from express
 * @param res     Response object from express
 * @param next    Next middleware function from express
 * @returns       void
 * @throws        AuthError
 */
export const onlyIfLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  //First lets check if the user has session id stored in cookie
  //If the user is not signed in, we throw AuthError
  if (!req.session || !req.session.userId) {
    return next(new AuthError("Not logged in! Please login to continue"));
  }
  next();
};
