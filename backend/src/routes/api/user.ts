import { Router, Request, Response, NextFunction } from "express";
import { updateUser } from "src/controller/user/userController";
import { updateUserSchema } from "src/controller/user/userSchema";
import { onlyIfLoggedIn } from "src/middleware/authCheck";
import { validateRequest } from "src/middleware/validateRequest";

const router = Router();

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
  .post(
    onlyIfLoggedIn,
    validateRequest(updateUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const currentUserId = req.session.userId as string;
        await updateUser(currentUserId, req.body);

        return res.status(200).send({ message: `User of id ${currentUserId} updated sucessfully!` });
      } catch (error) {
        next(error);
      }
    }
  );

export default router;
