import { sql } from "drizzle-orm";
import slugify from "slugify";
import db from "src/db";

import {
  preparedGetPropertyById,
  // preparedGetPropertyByKeyword,
  preparedInsertProperty
} from "src/db/preparedStatement";
import { property } from "src/model/property";

import logger from "src/utils/logger";

/**
 * @param dummyPropertyData array of property
 */
export const seedProperty = async (dummyPropertyData) => {
  await db.transaction(async (tx) => {
    for (const row of dummyPropertyData) {
      try {
        await tx.insert(property).values([
          {
            sellerId: row.sellerId,
            title: row.title,
            slug: row.title,
            description: row.description,
            toRent: row.toRent,
            address: row.address,
            closeLandmark: row.closeLandmark,
            propertyType: row.propertyType,
            availableFrom: row.availableFrom,
            availableTill: row.availableTill,
            price: row.price,
            negotiable: row.negotiable,
            imageUrl: row.imageUrl,
            status: row.status,
            expiresOn: row.expiresOn,
            views: 1
          }
        ]);
      } catch (error) {
        console.log(`Error inserting row: ${JSON.stringify(row)}`);
        console.log(error);
      }
    }
  });
};

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

/**
 * @param propertyId  string - property id of the searched property
 * @returns property
 */
export const getPropertyById = async (propertyId: string) => {
  console.log("Searching for property of id:", propertyId);
  const [propertyById] = await preparedGetPropertyById.execute({ propertyId });

  return propertyById;
};

/**
 *
 * @param keyword   string - keyword to search the title and description column in postgres
 * @returns         Property[] object
 */
export const searchPropertyByKeyword = async (keyword: string) => {
  console.log("Searching for property by keyword: ", keyword);

  //Let's say that user searched for `beach traditional`
  //How would we search for the property in the database?
  //In this implementation we are going to query in `search_vector` column which is generated
  //for every row and is stored alongside other fields. We use `to_tsvector` function provided by Postgres
  //We have setup to rank the row by title, description, close_landmark and address
  //Let's remove the space with pipe symbol to search it as we need to
  //supply this to postgres `beach | traditional`. The pipe is `OR` opeator
  //If we wanted to have both `beach` and `traditional` in the same property listing,
  //we would have to supply this to postgres `beach & traditional`.
  const normalisedKeyword = keyword.trim().replace(" ", " | ");

  //I had prepeared a statement `preparedGetPropertyByKeyword` which was supposed to be executed
  //to get the property by keyword, however it did not work as intended as I was not able to pass
  //value of `keyword` into the `sql.placeholder("keyword")`
  try {
    const propertyByKeyword = await db.execute(
      sql`SELECT *, ts_rank(search_vector, to_tsquery('english', ${normalisedKeyword})) as rank FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword}) ORDER BY rank desc;`
    );
    return propertyByKeyword.rows;
  } catch (error) {
    logger.error(`${error.message} - (${new Date().toISOString()})`, {
      error: error.message,
      stack: error.stack
    });
  }
};
