import { and, eq, gte, lte, sql } from "drizzle-orm";
import slugify from "slugify";
import { PROPERTY_COUNT_LIMIT_PER_PAGE } from "src/config";
import db from "src/db";

import {
  getListOfProperties,
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
 * @param price         integer - Price of the property
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
  price: number,
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

export const filterProperties = async (filters) => {
  try {
    //These are the fields that the users can search. It can be queried from url
    //so we are not following camel case to name the fields. Users can just type
    //and search using the api without having to remember which letter to capitalize
    const validFilterOptions: string[] = [
      "keyword",
      "torent",
      "address",
      "closelandmark",
      "propertytype",
      "availablefrom",
      "availabletill",
      "price",
      "minprice",
      "maxprice",
      "pricerange",
      "negotiable",
      "status",
      "listedAt",
      "updatedAt",
      "sortby",
      "order"
    ];
    const mapFilterOptions = new Map();
    for (const key in filters) {
      //The search query needs to be within the above filterProducts. User might search using `&test=ok`
      //and we might use it to query against the database. So, we only allow what can be queried
      //We also don't allow users to searches with same filter options twice in same request
      //Also if the user has provided the value for the query as well
      if (validFilterOptions.includes(key) && !mapFilterOptions.has(key) && filters[key].trim()) {
        mapFilterOptions.set(key, filters[key]);
      }
    }

    console.log("Filter Map: ", mapFilterOptions);
    console.log("Filter Map Length: ", mapFilterOptions.size);

    //if the length of query is 0, that is user has only visited the page
    //we return -1 to the api route handler which will then redirect the user
    //to `/api/v1/property?page=1`
    if (mapFilterOptions.size === 0) {
      return -1;
    }

    //if the filter is only one `keyword` then we return them with the function
    //that we have created below named `searchPropertyByKeyword`
    if (mapFilterOptions.size === 1 && filters.keyword) {
      const listOfProperties = await searchPropertyByKeyword(filters.keyword.trim(), 0);
      return listOfProperties;
    }

    const filteredProperties = await db
      .select()
      .from(property)
      .where(
        and(
          mapFilterOptions.get("torent") ? eq(property.toRent, mapFilterOptions.get("torent")) : undefined,
          mapFilterOptions.get("propertytype")
            ? eq(property.propertyType, mapFilterOptions.get("propertytype"))
            : undefined,
          mapFilterOptions.get("availablefrom")
            ? gte(property.availableFrom, mapFilterOptions.get("availablefrom"))
            : undefined,
          mapFilterOptions.get("availabletill")
            ? lte(property.availableTill, mapFilterOptions.get("availabletill"))
            : undefined,
          mapFilterOptions.get("price") ? eq(property.price, mapFilterOptions.get("price")) : undefined,
          mapFilterOptions.get("minprice")
            ? gte(property.price, mapFilterOptions.get("minprice"))
            : undefined,
          mapFilterOptions.get("maxprice") ? lte(property.price, mapFilterOptions.get("price")) : undefined,
          mapFilterOptions.get("pricerange")
            ? and(
                gte(property.price, mapFilterOptions.get("pricerange").split("-")[0]),
                lte(property.price, mapFilterOptions.get("pricerange").split("-")[1])
              )
            : undefined,
          mapFilterOptions.get("negotiable")
            ? eq(property.negotiable, mapFilterOptions.get("negotiable"))
            : undefined,
          mapFilterOptions.get("status") ? eq(property.status, mapFilterOptions.get("status")) : undefined,
          mapFilterOptions.get("listedat")
            ? gte(property.listedAt, mapFilterOptions.get("listedat"))
            : undefined,
          mapFilterOptions.get("updatedat")
            ? gte(property.updatedAt, mapFilterOptions.get("updatedat"))
            : undefined
        )
      );

    return filteredProperties;
  } catch (error) {
    console.log("Error occurred while filtering results!");
  }
};

/**
 * @param keyword   string - keyword to search the title and description column in postgres
 * @returns         Property[] object
 */
export const searchPropertyByKeyword = async (keyword: string, offset: number) => {
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
      sql`SELECT *, ts_rank(search_vector, to_tsquery('english', ${normalisedKeyword})) as rank FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword}) ORDER BY rank desc OFFSET ${offset * PROPERTY_COUNT_LIMIT_PER_PAGE} LIMIT ${PROPERTY_COUNT_LIMIT_PER_PAGE};`
    );
    const numberOfResults = await db.execute(
      sql`SELECT COUNT(*) FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword});`
    );

    return { numberOfProperties: numberOfResults.rows[0].count, properties: propertyByKeyword.rows };
  } catch (error) {
    logger.error(`${error.message} - (${new Date().toISOString()})`, {
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 *
 * @param offset number - start position to fetch the property
 * @returns Properties[]
 */
export const getListOfPropertiesByPagination = async (offset: number) => {
  try {
    const listOfProperties = await getListOfProperties.execute({
      limit: PROPERTY_COUNT_LIMIT_PER_PAGE,
      offset
    });

    console.log("List of properties: ", listOfProperties);

    return listOfProperties;
  } catch (error) {
    logger.error(`${error.message} - (${new Date().toISOString()})`, {
      error: error.message,
      stack: error.stack
    });
  }
};
