import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
import slugify from "slugify";
import { PROPERTY_COUNT_LIMIT_PER_PAGE } from "src/config";
import { v4 as uuidv4 } from "uuid";
import db from "src/db";

import {
  getListOfProperties,
  preparedDeletePropertyById,
  preparedGetPropertyById,
  preparedInsertHouse,
  preparedInsertLand,
  // preparedGetPropertyByKeyword,
  preparedInsertProperty
} from "src/db/preparedStatement";
import { property } from "src/model/property";

import logger from "src/utils/logger";
import { isAdmin } from "src/utils/isAdmin";

/**
 * @param dummyPropertyData array of property
 */
export const seedProperty = async (dummyPropertyData) => {
  await db.transaction(async (tx) => {
    for (const row of dummyPropertyData) {
      try {
        await tx.insert(property).values([
          {
            id: uuidv4(),
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
 * @route                   /api/v1/auth/property/new
 * @method                  POST
 * @desc                    Add new property listing
 * @param sellerId          string - ID in uuid format of the current user
 * @param title             string - Title of the listing of the property
 * @param description       string - Description of the property
 * @param toRent            boolean - Is property for rent?
 * @param address           string - Current implementation is to put address as a whole but need to create address table and add address to it and refer the address id instead on here
 * @param closeLandmark     string - Closest Landmark
 * @param propertyType      string - House | Flat | Apartment | Land | Building
 * @param availableFrom     string - Date in string from when the property is for sale or rent
 * @param availableTill     string - Date in string till the date where property is available
 * @param price             integer - Price of the property
 * @param negotiable        boolean - Is property negotiable
 * @param imageUrl          string[] - Array of image url
 * @param status            string - Sale | Hold | Sold
 * @param houseType         string - House | Flat | Shared | Room | Apartment | Bungalow | Villa
 * @param roomCount         number - number of rooms available
 * @param floorCount        number - number of floors available
 * @param kitchenCount      number - number of kitchen available
 * @param sharedBathroom    boolean - is the bathroom to be shared by others
 * @param bathroomCount     number - number of bathroom available
 * @param facilities        string[] - facilities or amentites provided
 * @param area              string - area in meter square
 * @param furnished         boolean - is the house furnished
 * @param facing            string - house facing a specific direction like North East
 * @param carParking        number - number of cark parking space available
 * @param bikeParking       number - number of bike parking space available
 * @param evCharging        boolean - can you charge ev where you park it
 * @param builtAt           string - date in string when the house was built
 * @param connectedToRoad   boolean - is the house connected to the road
 * @param distanceToRoad    number - distance in meters where the house can be connected to road
 * @returns                 string - uuid of the added property
 */
export const addProperty = async (sellerId: string, body) => {
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
      houseType,
      roomCount,
      floorCount,
      kitchenCount,
      sharedBathroom,
      bathroomCount,
      facilities,
      facing,
      area,
      furnished,
      carParking,
      bikeParking,
      evCharging,
      builtAt,
      connectedToRoad,
      distanceToRoad,
      landType,
      length,
      breadth
    } = body;
    const idOfToBeInsertedProperty = uuidv4();

    let propertyTypeId;
    if (propertyType.toUpperCase() === "HOUSE") {
      propertyTypeId = await addHouse(
        houseType,
        roomCount,
        floorCount,
        kitchenCount,
        sharedBathroom,
        bathroomCount,
        facilities,
        furnished,
        area,
        facing,
        carParking,
        bikeParking,
        evCharging,
        builtAt,
        connectedToRoad,
        distanceToRoad
      );
    } else if (propertyType.toUpperCase() === "LAND") {
      propertyTypeId = await addLand(landType, area, length, breadth, connectedToRoad, distanceToRoad);
    }

    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    await preparedInsertProperty.execute({
      id: idOfToBeInsertedProperty,
      sellerId,
      propertyTypeId: propertyTypeId,
      title,
      slug: `${idOfToBeInsertedProperty.split("-")[0]}-${slugify(title, { lower: true })}`,
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
      expiresOn: nextMonth.toISOString()
    });

    //Saving in the log file. I know it is so similar to the above prepared statement query
    //and also the function above. Each has its own purpose even though we have made a tower.
    logger.info(
      "Added new property",
      {
        id: idOfToBeInsertedProperty,
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
        expiresOn: nextMonth.toISOString()
      },
      true
    );

    //Even though the variable is named `idOfTheToBeInsertedProperty`, once we reach here
    //it is id of inserted property and still the same uuidv4 string
    return idOfToBeInsertedProperty;
  } catch (error) {
    logger.error(`${error.message} - (${new Date().toISOString()})`, {
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 * @route                   /api/v1/auth/property/new
 * @method                  POST
 * @desc                    Not a separate route. When the user submits property of type `House` this function is used
 * @param houseType         string - House | Flat | Shared | Room | Apartment | Bungalow | Villa
 * @param roomCount         number - number of rooms available
 * @param floorCount        number - number of floors available
 * @param kitchenCount      number - number of kitchen available
 * @param sharedBathroom    boolean - is the bathroom to be shared by others
 * @param bathroomCount     number - number of bathroom available
 * @param facilities        string[] - facilities or amentites provided
 * @param area              string - area in meter square
 * @param furnished         boolean - is the house furnished
 * @param facing            string - house facing a specific direction like North East
 * @param carParking        number - number of cark parking space available
 * @param bikeParking       number - number of bike parking space available
 * @param evCharging        boolean - can you charge ev where you park it
 * @param builtAt           string - date in string when the house was built
 * @param connectedToRoad   boolean - is the house connected to the road
 * @param distanceToRoad    number - distance in meters where the house can be connected to road
 * @returns                 string - id of the inserted house
 */
export const addHouse = async (
  houseType: string,
  roomCount: number,
  floorCount: number,
  kitchenCount: number,
  sharedBathroom: boolean,
  bathroomCount: number,
  facilities: string[],
  furnished: boolean,
  area: string,
  facing: string,
  carParking: number,
  bikeParking: number,
  evCharging: boolean,
  builtAt: string,
  connectedToRoad: boolean,
  distanceToRoad: number
) => {
  const idOfToBeInsertedHouse = uuidv4();

  await preparedInsertHouse.execute({
    id: idOfToBeInsertedHouse,
    houseType,
    roomCount,
    floorCount,
    kitchenCount,
    sharedBathroom,
    bathroomCount,
    facilities,
    area,
    furnished,
    facing,
    carParking,
    bikeParking,
    evCharging,
    builtAt,
    connectedToRoad,
    distanceToRoad
  });

  return idOfToBeInsertedHouse;
};

export const addLand = async (
  landType: string,
  area: string,
  length: string,
  breadth: string,
  connectedToRoad: boolean,
  distanceToRoad: number
) => {
  const idOfToBeInsertedLand = uuidv4();

  await preparedInsertLand.execute({
    id: idOfToBeInsertedLand,
    landType,
    area,
    length,
    breadth,
    connectedToRoad,
    distanceToRoad: connectedToRoad ? 0 : distanceToRoad
  });

  return idOfToBeInsertedLand;
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
      currentPage: filters.page ? Number(filters.page) : 1,
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
    const currentUserIsAdmin = await isAdmin(userId);
    if (currentUserIsAdmin) {
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

export const updatePropertyById = async (propertyId, currentUserId: string, propertyFieldsToUpdate) => {
  const propertyById = await getPropertyById(propertyId);

  //If property by its id does not exists we return 0 which we will use in the api handler
  //to throw NotFoundError with the status code of 404.
  if (!propertyById) {
    return 0;
  }

  //If the property listing is created by the current user then we allow the update to happen
  if (propertyById.sellerId === currentUserId) {
    await db.update(property).set(propertyFieldsToUpdate).where(eq(property.id, propertyId));
    return 1;
  }

  /**
   * If we are checking property's seller id is same as the current user id in the previous statement
   * then we might also use is currentuseradmin checking on the same if statement.
   * That might mean second query to the database which might not be needed. We exit out on that
   * if statement if the current user is the user that is providing the update fields.
   */
  const currentUserIsAdmin = await isAdmin(currentUserId);
  if (currentUserIsAdmin) {
    await db.update(property).set(propertyFieldsToUpdate).where(eq(property.id, propertyId));
    return 1;
  }

  //If the user who sent the request to update the property is neither the user who posted
  //the listing and isn't admin then we return -1 back to api handler where we throw
  //ForbiddenError with the status code of 403.
  return -1;
};
