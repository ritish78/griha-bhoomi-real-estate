import slugify from "slugify";

import { preparedInsertProperty } from "src/db/preparedStatement";

import logger from "src/utils/logger";

/**
 * @route               /api/v1/auth/property/new
 * @method              POST
 * @desc                Add new property listing
 * @param sellerId      String - ID in uuid format of the current user
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
 * @returns             void
 */
export const addProperty = async (
  sellerId: string,
  title: string,
  description: string,
  toRent: boolean,
  address: string,
  closeLandmark: string,
  propertyType: string,
  availableFrom: string,
  availableTill: string,
  price: string,
  negotiable: boolean,
  imageUrl: string[],
  status: string,
  expiresOn: string
) => {
  await preparedInsertProperty.execute({
    sellerId,
    title,
    slug: slugify(title, { lower: true }),
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
  });

  //Saving in the log file. I know it is so similar to the above prepared statement query
  //and also the function above. Each has its own purpose even though we have made a tower.
  logger.info(
    "Added new property",
    {
      sellerId,
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
    },
    true
  );
};
