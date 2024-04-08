import { Request, Response, NextFunction } from "express";
import { ServerError } from "src/utils/error";

/**
 *
 * @param req   Request object from express
 * @param res   Response object from express
 * @param next  Next middleware function from express
 * @returns     next()
 * @throws      ServerError
 */
export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
  // First, we store the current session info
  const sessionDataToRefresh = req.session;

  // Then, we regenerate the session
  req.session.regenerate((error) => {
    if (error) {
      // Handle session regeneration error
      throw new ServerError("Could not generate refresh token!");
    }

    // Restore the old session data to the new session
    Object.assign(req.session, sessionDataToRefresh);

    // Proceed to the next middleware
    next();
  });
};
