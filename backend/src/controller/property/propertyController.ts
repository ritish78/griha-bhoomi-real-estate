import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import slugify from "slugify";
import { PROPERTY_COUNT_LIMIT_PER_PAGE } from "src/config";
import db from "src/db";

import {
  getListOfProperties,
  preparedDeletePropertyById,
  preparedGetPropertyById,
  // preparedGetPropertyByKeyword,
  preparedInsertProperty
} from "src/db/preparedStatement";
import { property } from "src/model/property";
import { user } from "src/model/user";
import { NotFoundError } from "src/utils/error";

import logger from "src/utils/logger";
import { getUserById } from "../auth/authController";

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

/**
 * @param filters filters object from req.params
 * @returns Properties[] or -1 if no filter is provided
 */
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
      //The search query needs to be within the above `filterOptions`. User might search using `&test=ok`
      //and we might use it to query against the database. So, we only allow what can be queried
      //We also don't allow users to searches with same filter options twice in same request
      //Also if the user has provided the value for the query then only we take it for
      if (validFilterOptions.includes(key) && !mapFilterOptions.has(key) && filters[key].trim()) {
        //We are skipping if `torent` or `negotiable` key is provided and something other than true or false is provided
        if (
          (key === "torent" || key === "negotiable") &&
          !(filters[key] == "true" || filters[key] == "false")
        ) {
          continue;
        }
        //If user provides `ascending` or `descending` in full
        if (key === "order" && filters[key].toLowerCase().startsWith("asc")) {
          mapFilterOptions.set(key, "ASC");
        }
        if (key === "order" && filters[key].toLowerCase().startsWith("desc")) {
          mapFilterOptions.set(key, "DESC");
        }
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
      const listOfProperties = await searchPropertyByKeyword(filters.keyword.trim(), filters?.page || 0);
      return listOfProperties;
    }

    //To get the number of filtered properties, we use one select() from dizzle where we
    //get the count and also the list of properties from where() clause.
    const filteredProperties = await db
      .select({
        listOfProperties: property,
        numberOfFilteredProperties: sql<number>`count(*) over()`
        // tsrank: sql`ts_rank(search_vector, to_tsquery('english', '${mapFilterOptions.get("keyword").replace(" ", " | ")}')) as rank`
      })
      .from(property)
      .where(
        and(
          // mapFilterOptions.get("keyword")
          //   ? sql`search_vector @@ to_tsquery('english', '${mapFilterOptions.get("keyword").replace(" ", " | ")}')`
          //   : undefined,
          // Currently, tsvector search is not implemented in Drizzle and the above method did not work
          // It is in progress and will be implemented soon. So, need to look back in the future when searching
          // using keyword like how it is implemented in `searchPropertyByKeyword`
          mapFilterOptions.get("keyword")
            ? ilike(property.title, `%${mapFilterOptions.get("keyword")}%`)
            : undefined,
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
      )
      .limit(PROPERTY_COUNT_LIMIT_PER_PAGE)
      .offset(Number(filters.page ? filters.page - 1 : 0) * PROPERTY_COUNT_LIMIT_PER_PAGE);

    console.log("Filtered properties", filteredProperties);

    //We are returning in the shape of:
    /**
     * {
     *   "currentPage":"3",
     *   "numberOfPages":8,
     *   "listOfFilteredProperties": [
     *          { //...Properties object}
     *    ]
     * }
     */
    //Why are we mapping filteredProperties when returning the listOfFilteredProperties?
    //It is a list of properties and when we get it from the database, we get it in the shape of:
    //Reference this discussion on github: https://github.com/drizzle-team/drizzle-orm/discussions/610
    /**
     * {
     *   "currentPage": "1",
     *   "numberOfPages": 2,
     *   "listOfFilteredProperties": [
     *      { listOfProperties: {
     *            //...PropertiesObject ,
     *            "numberOfFilteredProperties": "2"
     *      } },
     *      { listOfProperties: {
     *            //...PropertiesObject ,
     *            "numberOfFilteredProperties": "2"
     *      } },
     *   ]
     * }
     */
    return {
      currentPage: filters.page ? filters.page : 1,
      numberOfPages: Math.ceil(
        filteredProperties[0].numberOfFilteredProperties / PROPERTY_COUNT_LIMIT_PER_PAGE
      ),
      listOfFilteredProperties: filteredProperties.map((result) => result.listOfProperties)
    };
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
    //Here there are two database query which is inefficient. Will merge the `filterProperties` and this function
    //once searching by ts_vector gets implemented.
    const propertyByKeyword = await db.execute(
      sql`SELECT *, ts_rank(search_vector, to_tsquery('english', ${normalisedKeyword})) as rank FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword}) ORDER BY rank desc OFFSET ${(offset - 1) * 2} LIMIT ${2};`
    );
    const numberOfResults = await db.execute(
      sql`SELECT COUNT(*) FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword});`
    );

    return {
      currentPage: Number(offset),
      numberOfPages: Math.ceil((numberOfResults.rows[0].count as number) / 2),
      numberOfProperties: Number(numberOfResults.rows[0].count),
      properties: propertyByKeyword.rows
    };
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

/**
 * @param userId      string - id of the user that is sending delete request
 * @param propertyId  string - id of property to delete
 * @returns           1 if deleted successfully
 */
export const deletePropertyById = async (userId: string, propertyId: string) => {
  try {
    const propertyById = await getPropertyById(propertyId);

    /**
     * Is it better to throw NotFoundError and say that the property does not exists!
     * Or instead, we throw AuthError and say that the user is not authorized to delete the property.
     * We might have private listing of property which user might know exists because
     * they might be sending delete requests with property id that might not exists
     */
    if (!propertyById) {
      // throw new NotFoundError("Property to delete does not exists!");
      // throw new AuthError("User is not authorized to perform this action!");
      return 0;
    }

    //Now let's check if the user is same as the user created the listing.
    //If the property listing and the user who provided the command to delete
    //is the same user then we delete the property.
    if (propertyById.sellerId === userId) {
      await preparedDeletePropertyById.execute({ propertyId });
      return 1;
    }

    //Now if the user isn't the user who created the listing then it leaves
    //if the user is admin of some kind. If the user is admin, then we allow
    //them to delete the property listing
    const userById = await getUserById(userId);
    if (userById.isAdmin || userById.role === "MODERATOR") {
      await preparedDeletePropertyById.execute({ propertyId });
      return 1;
    }

    //If the user who sent the delete request is neither an admin or moderator
    //and the user is not the same user who created the property listing
    //then we just skip it and throw ForbiddenError with status code 403 in the api handler
    return -1;
  } catch (error) {
    console.error("Error occurred while trying to delete property of id: ", propertyId);
    logger.error("Error deleting property", { userId, propertyId }, true);
  }
};
