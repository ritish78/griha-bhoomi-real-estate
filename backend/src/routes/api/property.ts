import { Router } from "express";
import { addProperty } from "src/controller/property/propertyController";
import { newPropertySchema } from "src/controller/property/propertySchema";
import { onlyIfLoggedIn } from "src/middleware/authCheck";
import { validateRequest } from "src/middleware/validateRequest";
import { AuthError } from "src/utils/error";

const router = Router();

/**
 * @route               /api/v1/auth/property/new
 * @method              POST
 * @desc                Add new property listing
 * @param title         String - Title of the listing of the property
 * @param description   String - Description of the property
 * @param toRent        Boolean - Is property for rent?
 * @param address       String - Current implementation is to put address as a whole but need to create address table and add address to it and refer the address id instead on here
 * @param closeLandmark String - Closest Landmark
 * @param propertyType  String - House | Flat | Apartment | Land | Building
 * @param availableFrom String - Date in string from when the property is for sale or rent
 * @param availableTill String - Date in string till the date where property is available
 * @param price         String - Price of the property
 * @param negotiable    Boolean - Is property negotiable
 * @param imageUrl      String[] - Array of image url
 * @param status        String - Sale | Hold | Sold
 * @param expiresOn     String - Date in string where the listing expires on the website
 * @returns             Response or NextFunction
 */
router.route("/new").post(onlyIfLoggedIn, validateRequest(newPropertySchema), async (req, res, next) => {
  const userId = req.session.userId;
  try {
    const {
      title,
      description,
      toRent,
      address,
      closeLandmark,
      propertyType,
      availableFrom,
      availableTill,
      price,
      negotiable,
      imageUrl,
      status,
      expiresOn
    } = req.body;
    console.log(userId, title, description);

    //In this below addProperty function, TypeScript throws error as userId
    //can be undefined. However that should not be the case as we already have
    //`onlyIfLoggedIn` middleware which will throw AuthError if userId is not present
    //The way to solve it could be to add `!` in the above line where we have;
    //const userId = req.session.userId!;
    //Howerver, let's add a if clause to check if userId isn't null or undefined
    //even if it should not be possible.
    if (!userId) {
      throw new AuthError("Could not verify the user! Please sign in to perfom this action!");
    }

    await addProperty(
      userId,
      title,
      description,
      toRent,
      address,
      closeLandmark,
      propertyType,
      availableFrom,
      availableTill,
      price,
      negotiable,
      imageUrl,
      status,
      expiresOn ? expiresOn : new Date()
    );

    return res.status(201).send({ message: "New Property added!" });
  } catch (error) {
    next(error);
  }
});

export default router;
