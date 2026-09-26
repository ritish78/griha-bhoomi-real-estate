import { and, asc, desc, eq, gt, gte, ilike, isNull, lte, ne, or, sql } from "drizzle-orm";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { PROPERTY_COUNT_LIMIT_PER_PAGE } from "src/config";
import db from "src/db";

import {
  getListOfProperties,
  preparedGetMyProperties,
  preparedGetMyPropertyCounts,
  preparedGetPropertyByFeaturedStatus,
  preparedGetPropertyById,
  preparedGetPropertyBySlug,
  preparedInsertHouse,
  preparedInsertLand,
  // preparedGetPropertyByKeyword,
  preparedInsertProperty
} from "src/db/preparedStatement";
import { Property, property } from "src/model/property";

import logger from "src/utils/logger";
import { isAdmin } from "src/utils/isAdmin";
import { hasHouseFields, hasLandFields } from "src/middleware/validateRequest";
import { house } from "src/model/house";
import { land } from "src/model/land";
import { addAddress, updateAddressById } from "../address/addressController";
import { address } from "src/model/address";
import { buildRadiusCondition } from "src/utils/buildRadiusCondition";
import { BadRequestError, ForbiddenError, NotFoundError } from "src/utils/error";
import { parseFacilities } from "./facilitiesSchema";
import { updatePropertySchema } from "./propertySchema";
import { newAddressSchema, updateAddressSchema } from "../address/addressSchema";
import { updateHouseSchema } from "./houseSchema";
import { updateLandSchema } from "./landSchema";
import { user } from "src/model/user";

/**
 * @param dummyPropertyData array of property
 */
// export const seedProperty = async (dummyPropertyData) => {
//   await db.transaction(async (tx) => {
//     for (const row of dummyPropertyData) {
//       try {
//         await tx.insert(property).values([
//           {
//             id: uuidv4(),
//             sellerId: row.sellerId,
//             title: row.title,
//             slug: row.title,
//             description: row.description,
//             toRent: row.toRent,
//             address: row.address,
//             closeLandmark: row.closeLandmark,
//             propertyType: row.propertyType,
//             availableFrom: row.availableFrom,
//             availableTill: row.availableTill,
//             price: row.price,
//             negotiable: row.negotiable,
//             imageUrl: row.imageUrl,
//             status: row.status,
//             expiresOn: row.expiresOn,
//             views: 1
//           }
//         ]);
//       } catch (error) {
//         console.log(`Error inserting row: ${JSON.stringify(row)}`);
//         console.log(error);
//       }
//     }
//   });
// };

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
 * @param landType          string - plotting | residential | agricultural | industrial
 * @param area              string - area of the land
 * @param length            length - length of the land
 * @param breadth           breadth - length of the land
 * @returns                 string - uuid of the added property
 */
export const addProperty = async (sellerId: string, body) => {
  try {
    //We validate the address before inserting house, land or property info.
    //Every new listing needs both coordinates, even when its address was entered manually.
    const addressFields = newAddressSchema.parse({ body }).body;
    body = { ...body, ...addressFields };

    if (body.propertyType !== "House" && body.propertyType !== "Land") {
      throw new BadRequestError("Invalid property type.");
    }

    const selectedFacilities = parseFacilities(body.facilities, body.propertyType);

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
      // facilities,
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
      breadth,
      houseNumber,
      street,
      wardNumber,
      municipality,
      city,
      district,
      province,
      latitude,
      longitude
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

    const addressId = await addAddress(
      houseNumber,
      street,
      wardNumber,
      municipality,
      city,
      district,
      province,
      latitude,
      longitude
    );

    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    //i want to make title to appear before the id of the property
    //as it makes the url more user friendly
    const slug = `${slugify(title, { lower: true })}-${idOfToBeInsertedProperty.split("-")[0]}`;

    await preparedInsertProperty.execute({
      id: idOfToBeInsertedProperty,
      sellerId,
      propertyTypeId: propertyTypeId,
      title,
      slug,
      description,
      toRent,
      address: addressId,
      closeLandmark,
      propertyType,
      availableFrom,
      availableTill,
      price,
      negotiable,
      facilities: selectedFacilities,
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
    return { idOfToBeInsertedProperty, slug };
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
    area,
    furnished,
    facing,
    carParking,
    bikeParking,
    evCharging,
    builtAt,
    connectedToRoad,
    distanceToRoad: connectedToRoad ? 0 : distanceToRoad
  });

  return idOfToBeInsertedHouse;
};

/**
 * @param landType          string - plotting | residential | agricultural | industrial
 * @param area              string - area of the land
 * @param length            length - length of the land
 * @param breadth           breadth - length of the land
 * @param connectedToRoad   boolean - is land connected to road
 * @param distanceToRoad    number - distance from land to the road
 * @returns
 */
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
 * @param userId      string | undefined - user id if signed in or undefined if not signed in
 * @returns           Property
 */
export const getPropertyById = async (propertyId: string, userId, countView: boolean = true) => {
  console.log("Searching for property of id:", propertyId);
  const [propertyById] = (await preparedGetPropertyById.execute({ propertyId })) as Property[];

  ///if property does not exists, we immediately return null back from the function
  if (!propertyById) {
    return null;
  }

  if (!propertyById.private && new Date(propertyById.expiresOn) > new Date()) {
    //If the property listing hasn't expired and the property is not set to private
    //finally, we increase the view count of the property by one before returning property

    //We increase the view count only if the property listed by the user isn't the
    //current user. We rank the property by `featured` and `views` and we don't want
    //view botting by the user. However, this isn't fullproof as we increase the view
    //count if the current user isn't signed in.
    //Might reference it later to make it better.
    if (!userId || propertyById.sellerId !== userId) {
      //similar to the one in getPropertyBySlug
      if (countView) {
        await increaseViewOfProperty(propertyById.id);
        propertyById.views += 1;
      }
    }

    return propertyById;
  }

  //After quering the database to get the property using its id, we then
  //check if that property is set as private or is it expired.
  //If it satisfies either of the condition, then we then move to another check
  if (propertyById.private || new Date(propertyById.expiresOn) < new Date()) {
    //If the user id is not supplied and the property is set to private or is expired,
    //we return null
    if (!userId) {
      return null;
    }
    const currentUserIsAdmin = await isAdmin(userId);
    //if current user is the seller or an admin. If it satisfies one of the
    //condition, we then return property without increasing the views
    if (propertyById.sellerId === userId || currentUserIsAdmin) {
      return propertyById;
    } else {
      //If the current user is not the seller or an admin and the property is
      //listed as private, then we return null
      return null;
    }
  }

  return null;
};

/**
 * @param slug  string - slug of the searched property
 * @returns     Property
 */
export const getPropertyBySlug = async (
  slug: string,
  userId: string | undefined,
  countView: boolean = true
) => {
  const [propertyBySlug] = await preparedGetPropertyBySlug.execute({ slug });

  ///if property does not exists, we immediately return null back from the function
  if (!propertyBySlug) {
    return null;
  }

  if (!propertyBySlug.private && new Date(propertyBySlug.expiresOn) > new Date()) {
    //If the property listing hasn't expired and the property is not set to private
    //finally, we increase the view count of the property by one before returning property
    if (countView) {
      const updatedViews = await increaseViewOfProperty(propertyBySlug.id);

      if (updatedViews !== undefined) {
        propertyBySlug.views = updatedViews;
      }
    }

    return propertyBySlug;
  }

  //Similar to what we have implemented in the `getPropertyById` function
  if (propertyBySlug.private || new Date(propertyBySlug.expiresOn) < new Date()) {
    //If the user id is not supplied and the property is set to private or is expired,
    //we return null
    if (!userId) {
      return null;
    }
    const currentUserIsAdmin = await isAdmin(userId);
    //if current user is the seller or an admin. If it satisfies one of the
    //condition, we then return property without increasing the views
    if (propertyBySlug.sellerId === userId || currentUserIsAdmin) {
      return propertyBySlug;
    } else {
      //If the current user is not the seller or an admin and the property is
      //listed as private, then we return null
      return null;
    }
  }

  //If the property listing is expired, then we return null.
  if (new Date(propertyBySlug.expiresOn) > new Date()) {
    return null;
  }
};

/**
 * @param filters   filters object from req.params
 * @returns         Properties[] or -1 if no filter is provided
 */
export const filterProperties = async (filters) => {
  try {
    const radiusCondition = buildRadiusCondition(filters);
    //These are the fields that the users can search. It can be queried from url
    //so we are not following camel case to name the fields. Users can just type
    //and search using the api without having to remember which letter to capitalize
    const validPropertiesFilterOptions: string[] = [
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
      "listedat",
      "updatedat",
      "sortby",
      "order",
      "page"
    ];

    const validHouseFilterOptions: string[] = [
      "housetype",
      "roomcount",
      "minroomcount",
      "maxroomcount",
      "roomcountrange",
      "floorcount",
      "minfloorcount",
      "maxfloorcount",
      "kitchencount",
      "minkitchencount",
      "maxkitchencount",
      "sharedbathroom",
      "bathroomcount",
      "minbathroomcount",
      "maxbathroomcount",
      // "facilities",
      "area",
      "furnished",
      "facing",
      "carparking",
      "bikeparking",
      "evcharging",
      "builtat",
      "houseconnectedtoroad",
      "housedistancetoroad"
    ];

    const validLandFilterOptions: string[] = [
      "landtype",
      "area",
      "length",
      "breadth",
      "landconnectedtoroad",
      "landdistancetoroad"
    ];

    const validAddressFilterOptions: string[] = [
      "street",
      "wardnumber",
      "municipality",
      "city",
      "district",
      "province",
      "latitude",
      "longitude"
    ];

    const mapPropertyFilterOptions = new Map();
    const mapHouseFilterOptions = new Map();
    const mapLandFilterOptions = new Map();
    const mapAddressFilterOptions = new Map();

    for (const key in filters) {
      // These are handled by the spatial condition.
      // "location" is only a display label.
      if (["location", "latitude", "longitude", "radius"].includes(key)) {
        continue;
      }

      //The search query needs to be within the above `filterOptions`. User might search using `&test=ok`
      //and we might use it to query against the database. So, we only allow what can be queried
      //We also don't allow users to searches with same filter options twice in same request
      //Also if the user has provided the value for the query then only we take it for
      if (
        validPropertiesFilterOptions.includes(key) &&
        !mapPropertyFilterOptions.has(key) &&
        filters[key].trim()
      ) {
        //We are skipping if `torent` or `negotiable` key is provided and something other than true or false is provided
        if (
          (key === "torent" || key === "negotiable") &&
          !(filters[key] == "true" || filters[key] == "false")
        ) {
          continue;
        }
        //If user provides `ascending` or `descending` in full
        if (key === "order" && filters[key].toLowerCase().startsWith("asc")) {
          mapPropertyFilterOptions.set(key, "ASC");
        }
        if (key === "order" && filters[key].toLowerCase().startsWith("desc")) {
          mapPropertyFilterOptions.set(key, "DESC");
        }
        mapPropertyFilterOptions.set(key, filters[key]);
      } else if (validHouseFilterOptions.includes(key) && !mapHouseFilterOptions.has(key)) {
        //Now to add filter options for house
        mapHouseFilterOptions.set(key, filters[key]);

        //If `connectedtoroad` and `distancetoroad` fields are provided in the context
        //of land, we add to it. We could simplify it by storing those two fields in
        //property table itself instead of having both fields on both House and Land table
        // if (key === "connectedtoroad" || key === "distancetoroad") {
        //   mapLandFilterOptions.set(key, filters[key]);
        // }
      } else if (validLandFilterOptions.includes(key) && !mapLandFilterOptions.has(key)) {
        mapLandFilterOptions.set(key, filters[key]);
      } else if (validAddressFilterOptions.includes(key) && !mapAddressFilterOptions.has(key)) {
        mapAddressFilterOptions.set(key, filters[key]);
      }
    }

    //if the length of query is 0, that is user has only visited the page
    //we return -1 to the api route handler which will then redirect the user
    //to `/api/v1/property?page=1`
    if (
      mapPropertyFilterOptions.size === 0 &&
      mapHouseFilterOptions.size === 0 &&
      mapLandFilterOptions.size === 0 &&
      mapAddressFilterOptions.size === 0 &&
      !radiusCondition
    ) {
      return -1;
    }

    //TODO: If the user provides `keyword` along with other fields of other tables
    //it is neglected. We need to make it search with other fields as well
    //if the filter is only one `keyword` then we return them with the function
    //that we have created below named `searchPropertyByKeyword`
    // if (
    //   mapPropertyFilterOptions.size === 1 &&
    //   filters.keyword &&
    //   mapHouseFilterOptions.size === 0 &&
    //   mapLandFilterOptions.size === 0 &&
    //   mapAddressFilterOptions.size === 0
    // ) {
    //   const listOfProperties = await searchPropertyByKeyword(filters.keyword.trim(), filters?.page || 1);
    //   return listOfProperties;
    // }

    const sortField = mapPropertyFilterOptions.get("sortby") || "views";
    const sortOrder =
      mapPropertyFilterOptions.get("sortby") && mapPropertyFilterOptions.get("order") == "asc" ? asc : desc;

    const nowToday = new Date();
    const nowTodayInISOString = nowToday.toISOString();

    //To get the number of filtered properties, we use one select() from dizzle where we
    //get the count and also the list of properties from where() clause.
    const filteredProperties = await db
      .select({
        id: property.id,
        title: property.title,
        slug: property.slug,
        description: property.description,
        toRent: property.toRent,
        propertyType: property.propertyType,
        price: property.price,
        // facilities: property.facilities, //but does the filter really need facilities?
        imageUrl: property.imageUrl,
        status: property.status,
        featured: property.featured,
        views: property.views,
        street: address.street,
        municipality: address.municipality,
        city: address.city,
        district: address.district,
        roomCount: house.roomCount,
        bathroomCount: house.bathroomCount,
        houseArea: house.area,
        length: land.length,
        breadth: land.breadth,
        landArea: land.area,
        numberOfFilteredProperties: sql<number>`count(*) over()`
        // tsrank: sql`ts_rank(search_vector, to_tsquery('english', '${mapPropertyFilterOptions.get("keyword").replace(" ", " | ")}')) as rank`
      })
      .from(property)
      .leftJoin(address, eq(property.address, address.id))
      .leftJoin(house, eq(property.propertyTypeId, house.id))
      .leftJoin(land, eq(property.propertyTypeId, land.id))
      .where(
        and(
          radiusCondition,
          // mapPropertyFilterOptions.get("keyword")
          //   ? sql`search_vector @@ to_tsquery('english', '${mapPropertyFilterOptions.get("keyword").replace(" ", " | ")}')`
          //   : undefined,
          // TODO:
          // Currently, tsvector search is not implemented in Drizzle and the above method did not work
          // It is in progress and will be implemented soon. So, need to look back in the future when searching
          // using keyword like how it is implemented in `searchPropertyByKeyword`
          eq(property.private, false),
          gte(property.expiresOn, nowTodayInISOString),
          mapPropertyFilterOptions.get("keyword")
            ? ilike(property.title, `%${mapPropertyFilterOptions.get("keyword")}%`)
            : undefined,
          mapPropertyFilterOptions.get("torent")
            ? eq(property.toRent, mapPropertyFilterOptions.get("torent"))
            : undefined,
          mapPropertyFilterOptions.get("closelandmark")
            ? ilike(property.closeLandmark, `%${mapPropertyFilterOptions.get("closelandmark")}%`)
            : undefined,
          mapPropertyFilterOptions.get("propertytype")
            ? eq(property.propertyType, mapPropertyFilterOptions.get("propertytype"))
            : undefined,
          mapPropertyFilterOptions.get("availablefrom")
            ? gte(property.availableFrom, mapPropertyFilterOptions.get("availablefrom"))
            : undefined,
          mapPropertyFilterOptions.get("availabletill")
            ? lte(property.availableTill, mapPropertyFilterOptions.get("availabletill"))
            : undefined,
          mapPropertyFilterOptions.get("price")
            ? eq(property.price, mapPropertyFilterOptions.get("price"))
            : undefined,
          mapPropertyFilterOptions.get("minprice")
            ? gte(property.price, mapPropertyFilterOptions.get("minprice"))
            : undefined,
          mapPropertyFilterOptions.get("maxprice")
            ? lte(property.price, mapPropertyFilterOptions.get("maxprice"))
            : undefined,
          mapPropertyFilterOptions.get("pricerange")
            ? and(
                gte(property.price, mapPropertyFilterOptions.get("pricerange").split("-")[0]),
                lte(property.price, mapPropertyFilterOptions.get("pricerange").split("-")[1])
              )
            : undefined,
          mapPropertyFilterOptions.get("negotiable")
            ? eq(property.negotiable, mapPropertyFilterOptions.get("negotiable"))
            : undefined,
          mapPropertyFilterOptions.get("status")
            ? eq(property.status, mapPropertyFilterOptions.get("status"))
            : undefined,
          mapPropertyFilterOptions.get("listedat")
            ? gte(property.listedAt, mapPropertyFilterOptions.get("listedat"))
            : undefined,
          mapPropertyFilterOptions.get("updatedat")
            ? gte(property.updatedAt, mapPropertyFilterOptions.get("updatedat"))
            : undefined,
          //Filtering options for House
          mapHouseFilterOptions.get("housetype")
            ? eq(house.houseType, mapHouseFilterOptions.get("housetype"))
            : undefined,
          mapHouseFilterOptions.get("roomcount")
            ? eq(house.roomCount, mapHouseFilterOptions.get("roomcount"))
            : undefined,
          mapHouseFilterOptions.get("minroomcount")
            ? gte(house.roomCount, mapHouseFilterOptions.get("minroomcount"))
            : undefined,
          mapHouseFilterOptions.get("maxroomcount")
            ? lte(house.roomCount, mapHouseFilterOptions.get("maxroomcount"))
            : undefined,
          mapHouseFilterOptions.get("roomcountrange")
            ? and(
                gte(house.roomCount, mapHouseFilterOptions.get("roomcountrange").split("-")[0]),
                lte(house.roomCount, mapHouseFilterOptions.get("roomcountrange").split("-")[1])
              )
            : undefined,
          mapHouseFilterOptions.get("floorcount")
            ? eq(house.floorCount, mapHouseFilterOptions.get("floorcount"))
            : undefined,
          mapHouseFilterOptions.get("minfloorcount")
            ? gte(house.floorCount, mapHouseFilterOptions.get("minfloorcount"))
            : undefined,
          mapHouseFilterOptions.get("maxfloorcount")
            ? lte(house.floorCount, mapHouseFilterOptions.get("maxfloorcount"))
            : undefined,
          mapHouseFilterOptions.get("kitchencount")
            ? eq(house.kitchenCount, mapHouseFilterOptions.get("kitchencount"))
            : undefined,
          mapHouseFilterOptions.get("minkitchencount")
            ? gte(house.kitchenCount, mapHouseFilterOptions.get("minkitchencount"))
            : undefined,
          mapHouseFilterOptions.get("maxkitchencount")
            ? lte(house.kitchenCount, mapHouseFilterOptions.get("maxkitchencount"))
            : undefined,
          mapHouseFilterOptions.get("sharedbathroom")
            ? eq(house.sharedBathroom, mapHouseFilterOptions.get("sharedbathroom"))
            : undefined,
          mapHouseFilterOptions.get("bathroomcount")
            ? eq(house.bathroomCount, mapHouseFilterOptions.get("bathroomcount"))
            : undefined,
          mapHouseFilterOptions.get("minbathroomcount")
            ? gte(house.bathroomCount, mapHouseFilterOptions.get("minbathroomcount"))
            : undefined,
          mapHouseFilterOptions.get("maxbathroomcount")
            ? lte(house.bathroomCount, mapHouseFilterOptions.get("maxbathroomcount"))
            : undefined,
          // mapHouseFilterOptions.get("facilities")    //TODO: Filters are arrays
          // mapHouseFilterOptions.get("area")          //TODO: We have set area to be of type string
          //The area may or may not be of same unit. eg. meter square, square feet
          mapHouseFilterOptions.get("furnished")
            ? eq(house.furnished, mapHouseFilterOptions.get("furnished"))
            : undefined,
          mapHouseFilterOptions.get("facing")
            ? eq(house.facing, mapHouseFilterOptions.get("facing"))
            : undefined,
          mapHouseFilterOptions.get("carparking")
            ? gte(house.carParking, mapHouseFilterOptions.get("carparking"))
            : undefined,
          mapHouseFilterOptions.get("bikeparking")
            ? gte(house.bikeParking, mapHouseFilterOptions.get("bikeparking"))
            : undefined,
          mapHouseFilterOptions.get("evcharging")
            ? eq(house.evCharging, mapHouseFilterOptions.get("evcharging"))
            : undefined,
          //To get the built at, if user only provides the year; we create
          //date object where it specifies the first day of the year and if
          //the user supplies date like; 2004-05-01, then we use it instead
          //of having to create a date object
          mapHouseFilterOptions.get("builtat")
            ? gte(
                house.builtAt,
                mapHouseFilterOptions.get("builtat").length > 4
                  ? mapHouseFilterOptions.get("builtat")
                  : new Date(mapHouseFilterOptions.get("builtat"), 0, 1)
              )
            : undefined,
          mapHouseFilterOptions.get("houseconnectedtoroad")
            ? eq(house.connectedToRoad, mapHouseFilterOptions.get("houseconnectedtoroad"))
            : undefined,
          mapHouseFilterOptions.get("housedistancetoroad")
            ? lte(house.distanceToRoad, mapHouseFilterOptions.get("housedistancetoroad"))
            : undefined,
          //Now, filtering options for Land
          mapLandFilterOptions.get("landtype")
            ? eq(land.landType, mapLandFilterOptions.get("landtype"))
            : undefined,
          // mapLandFilterOptions.get("length")
          //TODO: Area, length and breadth are of type string
          mapLandFilterOptions.get("landconnectedtoroad")
            ? eq(land.connectedToRoad, mapLandFilterOptions.get("landconnectedtoroad"))
            : undefined,
          mapLandFilterOptions.get("landdistancetoroad")
            ? and(
                eq(land.connectedToRoad, false),
                lte(land.distanceToRoad, mapLandFilterOptions.get("landdistancetoroad"))
              )
            : undefined,

          //Now filtering options for Address
          mapAddressFilterOptions.get("street")
            ? ilike(address.street, `%${mapAddressFilterOptions.get("street")}%`)
            : undefined,
          mapAddressFilterOptions.get("wardnumber")
            ? eq(address.wardNumber, mapAddressFilterOptions.get("wardnumber"))
            : undefined,
          mapAddressFilterOptions.get("municipality")
            ? ilike(address.municipality, `%${mapAddressFilterOptions.get("municipality")}%`)
            : undefined,
          mapAddressFilterOptions.get("city")
            ? ilike(address.city, `%${mapAddressFilterOptions.get("city")}%`)
            : undefined,
          mapAddressFilterOptions.get("district")
            ? ilike(address.district, `%${mapAddressFilterOptions.get("district")}%`)
            : undefined,
          mapAddressFilterOptions.get("province")
            ? ilike(address.province, `%${mapAddressFilterOptions.get("province")}%`)
            : undefined
        )
      )
      .orderBy(desc(property.featured), sortOrder(property[sortField]))
      .limit(PROPERTY_COUNT_LIMIT_PER_PAGE)
      .offset(Number(filters.page ? filters.page - 1 : 0) * PROPERTY_COUNT_LIMIT_PER_PAGE);

    // console.log("Filtered properties", filteredProperties);

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
      currentPageNumber: filters.page ? Number(filters.page) : 1,
      numberOfPages:
        filteredProperties.length > 0
          ? Math.ceil(filteredProperties[0].numberOfFilteredProperties / PROPERTY_COUNT_LIMIT_PER_PAGE)
          : 1,
      properties: filteredProperties.length > 0 ? filteredProperties : []
    };
  } catch (error) {
    console.error("Error occurred while filtering results:", error);
    throw error;
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

  const nowToday = new Date();
  const nowTodayInISOString = nowToday.toISOString();

  //I had prepeared a statement `preparedGetPropertyByKeyword` which was supposed to be executed
  //to get the property by keyword, however it did not work as intended as I was not able to pass
  //value of `keyword` into the `sql.placeholder("keyword")`
  try {
    //TODO:
    //Here there are two database query which is inefficient. Will merge the `filterProperties` and this function
    //once searching by ts_vector gets implemented.
    const propertyByKeyword = await db.execute(
      sql`SELECT *, ts_rank(search_vector, to_tsquery('english', ${normalisedKeyword})) as rank FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword}) AND private=${false} AND expires_on >=${nowTodayInISOString} ORDER BY rank desc OFFSET ${(offset - 1) * 2} LIMIT ${2};`
    );
    const numberOfResults = await db.execute(
      sql`SELECT COUNT(*) FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword}) AND private=${false} AND expires_on >=${nowTodayInISOString};`
    );

    console.log("Number of results: ", numberOfResults.rows[0].count);
    console.log("Number of results: ", numberOfResults.rows[0].count);
    console.log("Number of results: ", numberOfResults.rows[0].count);

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
 * @param offset    number - start position to fetch the property
 * @param limit     number - number of properties to fetch per call
 * @returns         Properties[]
 */
export const getListOfPropertiesByPagination = async (
  offset: number,
  limit: number = PROPERTY_COUNT_LIMIT_PER_PAGE
) => {
  try {
    const listOfProperties = await getListOfProperties.execute({
      limit,
      offset
    });

    return listOfProperties;
  } catch (error) {
    logger.error(`${error.message} - (${new Date().toISOString()})`, {
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 * @param offset    number - start position to fetch the property
 * @param limit     number - limit the number of featured properties to fetch from db
 * @returns         Properties[] where featured === true
 */
export const getListOfFeaturedPropertiesByPagination = async (offset: number, limit: number) => {
  try {
    const listOfFeaturedProperties = await preparedGetPropertyByFeaturedStatus.execute({
      limit,
      offset
    });

    return listOfFeaturedProperties;
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
    const propertyById = await getPropertyById(propertyId, userId, false);

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
      await deleteProperty(propertyById);
      return 1;
    }

    //Now if the user isn't the user who created the listing then it leaves
    //if the user is admin of some kind. If the user is admin, then we allow
    //them to delete the property listing
    const currentUserIsAdmin = await isAdmin(userId);
    if (currentUserIsAdmin) {
      await deleteProperty(propertyById);
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

/**
 * @param propertyId                string - id of the property to update
 * @param currentUserId             string - id of the current user
 * @param propertyFieldsToUpdate    object - property fields to update
 * @returns                         0 if no property of provided id is found | 1 if updated succesfully | -1 if the user is not authorized to update property
 */
export const updatePropertyById = async (
  propertyId: string,
  currentUserId: string,
  propertyFieldsToUpdate
) => {
  const propertyById = await getPropertyById(propertyId, currentUserId);

  //If property by its id does not exists we return 0 which we will use in the api handler
  //to throw NotFoundError with the status code of 404.
  if (!propertyById) {
    return 0;
  }

  const currentUserCanEdit = propertyById.sellerId === currentUserId || (await isAdmin(currentUserId));

  /**
   * If we are checking property's seller id is same as the current user id in the previous statement
   * then we might also use is currentuseradmin checking on the same if statement.
   * That might mean second query to the database which might not be needed. We exit out on that
   * if statement if the current user is the user that is providing the update fields.
   */
  if (!currentUserCanEdit) {
    return -1;
  }

  //We validate the common property fields using our existing update schema.
  //Keep the original request object because house, land and address fields
  //will be filtered and validated separately below.
  const parsedPropertyFieldsToUpdate = updatePropertySchema.parse({ body: propertyFieldsToUpdate }).body;

  //The user can change House Type or Land Type, but cannot change the listing
  //itself from House to Land or from Land to House.
  if (
    parsedPropertyFieldsToUpdate.propertyType !== undefined &&
    parsedPropertyFieldsToUpdate.propertyType !== propertyById.propertyType
  ) {
    throw new BadRequestError("The property type cannot be changed after listing.");
  }

  if (propertyFieldsToUpdate.facilities !== undefined) {
    propertyFieldsToUpdate = {
      ...propertyFieldsToUpdate,
      facilities: parseFacilities(propertyFieldsToUpdate.facilities, propertyById.propertyType)
    };
  }

  //The list contains what the user can update of the property listing.
  const validUpdatePropertyOptions: string[] = [
    "title",
    "description",
    "toRent",
    "closeLandmark",
    "availableFrom",
    "availableTill",
    "price",
    "negotiable",
    "facilities",
    "imageUrl",
    "status",
    "private"
  ];

  //We get all the fields for property, house, land and address to update in the body
  //We then create a object which contains only the keys that the user can update of property table
  const validPropertyFieldsToUpdate = Object.keys(propertyFieldsToUpdate)
    .filter((key) => validUpdatePropertyOptions.includes(key))
    .reduce((obj, key) => {
      obj[key] = propertyFieldsToUpdate[key];
      return obj;
    }, {});

  //When the user updates only one availability date, we compare it against
  //the other saved date instead of requiring both dates in every update.
  if (
    parsedPropertyFieldsToUpdate.availableFrom !== undefined ||
    parsedPropertyFieldsToUpdate.availableTill !== undefined
  ) {
    const availableFrom = parsedPropertyFieldsToUpdate.availableFrom ?? propertyById.availableFrom;
    const availableTill = parsedPropertyFieldsToUpdate.availableTill ?? propertyById.availableTill;

    if (availableTill && new Date(availableTill) <= new Date(availableFrom)) {
      throw new BadRequestError("Available till must be after available from.");
    }
  }

  //The address update schema reuses the fields from newAddressSchema.
  //We update the address already linked to the property, not an ID from the request.
  const addressFieldsToUpdate = updateAddressSchema.parse({ body: propertyFieldsToUpdate }).body;
  const hasAddressChanges = Object.values(addressFieldsToUpdate).some((value) => value !== undefined);
  const addressId = propertyById.address;

  if (hasAddressChanges && !addressId) {
    throw new NotFoundError("Property address not found!");
  }

  //We do the same for house table. We have fields that the user can update
  const validUpdateHouseOptions: string[] = [
    "houseType",
    "roomCount",
    "floorCount",
    "kitchenCount",
    "sharedBathroom",
    "bathroomCount",
    "area",
    "furnished",
    "facing",
    "carParking",
    "bikeParking",
    "evCharging",
    "builtAt",
    "connectedToRoad",
    "distanceToRoad"
  ];

  //Like what we did in the above property fields to update, we create an object which
  //contains all the valid fields that the user can update in the house table
  const validHouseFieldsToUpdate = Object.keys(propertyFieldsToUpdate)
    .filter((key) => validUpdateHouseOptions.includes(key))
    .reduce((obj, key) => {
      obj[key] = propertyFieldsToUpdate[key];
      return obj;
    }, {});

  //Again, same as the above two tables, we specify what the user can update
  const validUpdateLandOptions: string[] = [
    "landType",
    "area",
    "length",
    "breadth",
    "connectedToRoad",
    "distanceToRoad"
  ];

  //Creating another object which contains the key and value of what the user
  //intends to update. We use it to query against the database
  const validLandFieldsToUpdate = Object.keys(propertyFieldsToUpdate)
    .filter((key) => validUpdateLandOptions.includes(key))
    .reduce((obj, key) => {
      obj[key] = propertyFieldsToUpdate[key];
      return obj;
    }, {});

  //We validate the fields for the saved property type before updating any table.
  //The filtered objects exist for both types, so checking the object alone
  //does not tell us whether this listing is a House or Land.
  let houseFieldsToUpdate;
  let landFieldsToUpdate;

  if (propertyById.propertyType === "House" && Object.keys(validHouseFieldsToUpdate).length > 0) {
    houseFieldsToUpdate = updateHouseSchema.parse(validHouseFieldsToUpdate);
  } else if (propertyById.propertyType === "Land" && Object.keys(validLandFieldsToUpdate).length > 0) {
    console.log("UPDATING LAND INFO:", validLandFieldsToUpdate);
    console.log("UPDATING LAND INFO:", validLandFieldsToUpdate);
    landFieldsToUpdate = updateLandSchema.parse(validLandFieldsToUpdate);
  }

  //All the fields have been validated and the user's permission has been checked.
  //We use one transaction so that if any update fails, changes to the other
  //tables are rolled back as well.
  await db.transaction(async (tx) => {
    if (hasAddressChanges && addressId) {
      await updateAddressById(propertyId, addressId, addressFieldsToUpdate, tx);
    }

    if (houseFieldsToUpdate) {
      await updateHouseListingById(propertyById.propertyTypeId, houseFieldsToUpdate, tx);
    } else if (landFieldsToUpdate) {
      await updateLandListingById(propertyById.propertyTypeId, landFieldsToUpdate, tx);
    }

    //This also updates the listing's updatedAt value when only its
    //address or House/Land details have changed.
    await updatePropertyListingById(propertyId, validPropertyFieldsToUpdate, tx);
  });

  return 1;

  // let updated = false;

  // if (propertyById.propertyType.toUpperCase() === "HOUSE" && hasHouseFields(validHouseFieldsToUpdate)) {
  //   await updateHouseListingById(propertyById.propertyTypeId, validHouseFieldsToUpdate);

  //   updated = true;
  // } else if (propertyById.propertyType.toUpperCase() === "LAND" && hasLandFields(validLandFieldsToUpdate)) {
  //   await updateLandListingById(propertyById.propertyTypeId, validLandFieldsToUpdate);

  //   updated = true;
  // }

  // //we have already checked for permission above for both owners and admin
  // if (Object.keys(validPropertyFieldsToUpdate).length > 0) {
  //   await updatePropertyListingById(propertyId, validPropertyFieldsToUpdate);

  //   updated = true;
  // }

  // //If the user who sent the request to update the property is neither the user who posted
  // //the listing and isn't admin then we return -1 back to api handler where we throw
  // //ForbiddenError with the status code of 403.
  // return updated ? 1 : -1;
};

/**
 * @param propertyToDelete        Property - Property object that the user is intending to delete
 */
const deleteProperty = async (propertyToDelete: Property) => {
  //We have property, address and house or land info to delete.
  //We use a transaction so that if any of the deletion fails,
  //the changes made to the other tables are rolled back as well.
  await db.transaction(async (tx) => {
    //First we delete the property listing as it references the address.
    //The bookmarks of this property are deleted automatically because
    //their foreign key has onDelete set to cascade.
    const [deletedProperty] = await tx
      .delete(property)
      .where(eq(property.id, propertyToDelete.id))
      .returning({
        address: property.address,
        propertyType: property.propertyType,
        propertyTypeId: property.propertyTypeId
      });

    //We already checked if the property exists in deletePropertyById.
    //However, another request might have deleted it before this query.
    //If the property does not exists, we throw NotFoundError.
    if (!deletedProperty) {
      throw new NotFoundError("Property to delete does not exists!");
    }

    //Now let's check if the property has an address linked to it.
    //If it has an address, then we delete that address using its id.
    if (deletedProperty.address) {
      await tx.delete(address).where(eq(address.id, deletedProperty.address));
    }

    //Now we check if the property listing is of house or land.
    //If the property is a house, then we delete its house info.
    //Otherwise, if it is land, then we delete its land info.
    if (deletedProperty.propertyType.toUpperCase() === "HOUSE") {
      await tx.delete(house).where(eq(house.id, deletedProperty.propertyTypeId));
    } else if (deletedProperty.propertyType.toUpperCase() === "LAND") {
      await tx.delete(land).where(eq(land.id, deletedProperty.propertyTypeId));
    }
  });
};

/**
 * @param propertyId                string - id of the property to update
 * @param propertyFieldsToUpdate    object - property fields to update
 * @returns                         Promise<void>
 */
const updatePropertyListingById = async (
  propertyId: string,
  propertyFieldsToUpdate,
  database: Pick<typeof db, "update"> = db
) => {
  propertyFieldsToUpdate.updatedAt = new Date();
  await database.update(property).set(propertyFieldsToUpdate).where(eq(property.id, propertyId));
};

/**
 * @param houseId                   string - id of the house to update
 * @param houseFieldsToUpdate       object - house fields to update
 * @returns                         Promise<void>
 */
const updateHouseListingById = async (
  houseId: string,
  houseFieldsToUpdate,
  database: Pick<typeof db, "update"> = db
) => {
  await database.update(house).set(houseFieldsToUpdate).where(eq(house.id, houseId));
};

/**
 * @param landId                    string - id of the land to update
 * @param landFieldsToUpdate        object - land fields to update
 * @returns                         Promise<void>
 */
const updateLandListingById = async (
  landId: string,
  landFieldsToUpdate,
  database: Pick<typeof db, "update"> = db
) => {
  await database.update(land).set(landFieldsToUpdate).where(eq(land.id, landId));
};

/**
 * @param propertyId      string - id of the property to update
 */
const increaseViewOfProperty = async (propertyId: string) => {
  const [updatedProperty] = await db
    .update(property)
    .set({
      views: sql`${property.views} + 1`
    })
    .where(eq(property.id, propertyId))
    .returning({ views: property.views });

  return updatedProperty?.views;
};

/**
 * @param propertyId      string - id of the property to set as private or remove as private
 * @param currentUserId   string - id of the current user
 */
export const togglePropertyPrivate = async (propertyId: string, currentUserId: string) => {
  const propertyById = await getPropertyById(propertyId, currentUserId);

  if (!propertyById) {
    return null;
  }

  //If the current user is the one who posted the property listing
  //we then allow to toggle the property private status
  if (propertyById.sellerId === currentUserId) {
    await propertyPrivateToggleHandler(propertyById, propertyId);
    return true;
  }

  const currentUserIsAdmin = await isAdmin(currentUserId);
  if (currentUserIsAdmin) {
    await propertyPrivateToggleHandler(propertyById, propertyId);
    return true;
  } else {
    return null;
  }
};

/**
 * @param propertyById    Property - property to update the private status
 * @param propertyId      string - id of the property to update
 */
const propertyPrivateToggleHandler = async (propertyById: Property, propertyId: string) => {
  const nowToday = new Date();

  await db
    .update(property)
    .set({ private: !propertyById.private, updatedAt: nowToday })
    .where(eq(property.id, propertyId));
};

/**
 * Load the values required by the edit-property form.
 * Only the listing owner or an admin may access them.
 */
export const getPropertyForEdit = async (slug: string, currentUserId: string) => {
  const propertyBySlug = await getPropertyBySlug(slug, currentUserId, false);

  if (!propertyBySlug) {
    throw new NotFoundError("Property to update not found!");
  }

  if (!propertyBySlug.sellerId || propertyBySlug.sellerId !== currentUserId || !isAdmin(currentUserId)) {
    throw new ForbiddenError("You are not allowed to edit this property!");
  }

  if (!propertyBySlug.address) {
    throw new NotFoundError("Property address not found!");
  }

  //Verify that the LEFT JOIN found the address record.
  //These columns are NOT NULL in the address table.
  if (
    propertyBySlug.city === null ||
    propertyBySlug.district === null ||
    propertyBySlug.province === null ||
    propertyBySlug.wardNumber === null
  ) {
    throw new NotFoundError("Property address details not found!");
  }

  const isHouse = propertyBySlug.propertyType === "House";

  if ((isHouse && propertyBySlug.houseType === null) || (!isHouse && propertyBySlug.landType === null)) {
    throw new NotFoundError("Property details not found!");
  }

  const commonValues = {
    title: propertyBySlug.title,
    description: propertyBySlug.description,
    price: propertyBySlug.price,
    negotiable: propertyBySlug.negotiable,
    toRent: propertyBySlug.toRent,
    propertyType: propertyBySlug.propertyType,
    status: propertyBySlug.status,
    availableFrom: propertyBySlug.availableFrom,
    availableTill: propertyBySlug.availableTill,
    closeLandmark: propertyBySlug.closeLandmark ?? "",
    imageUrl: propertyBySlug.imageUrl ?? [],
    facilities: propertyBySlug.facilities ?? [],

    houseNumber: propertyBySlug.houseNumber ?? "",
    street: propertyBySlug.street ?? "",
    wardNumber: propertyBySlug.wardNumber,
    municipality: propertyBySlug.municipality ?? "",
    city: propertyBySlug.city,
    district: propertyBySlug.district,
    province: propertyBySlug.province,
    latitude: propertyBySlug.latitude,
    longitude: propertyBySlug.longitude
  };

  const typeValues = isHouse
    ? {
        houseType: propertyBySlug.houseType,
        roomCount: propertyBySlug.roomCount,
        floorCount: propertyBySlug.floorCount,
        kitchenCount: propertyBySlug.kitchenCount,
        sharedBathroom: propertyBySlug.sharedBathroom,
        bathroomCount: propertyBySlug.bathroomCount,
        furnished: propertyBySlug.furnished,
        carParking: propertyBySlug.carParking,
        bikeParking: propertyBySlug.bikeParking,
        evCharging: propertyBySlug.evCharging,
        builtAt: propertyBySlug.builtAt,

        // Convert query aliases to the form's field names.
        facing: propertyBySlug.houseFacing ?? "",
        area: propertyBySlug.houseArea ?? "",
        connectedToRoad: propertyBySlug.houseConnectedToRoad,
        distanceToRoad: propertyBySlug.houseDistanceToRoad
      }
    : {
        landType: propertyBySlug.landType,
        length: propertyBySlug.length ?? "",
        breadth: propertyBySlug.breadth ?? "",

        area: propertyBySlug.landArea ?? "",
        connectedToRoad: propertyBySlug.landConnectedToRoad,
        distanceToRoad: propertyBySlug.landDistanceToRoad
      };

  return {
    id: propertyBySlug.id,
    slug: propertyBySlug.slug,
    values: {
      ...commonValues,
      ...typeValues
    }
  };
};

/**
 * @param slug          string - slug of the property currently being viewed
 * @param currentUserId string - id of the current user, if logged in
 * @returns             Similar properties ordered nearest first
 */
export const getSimilarProperties = async (slug: string, currentUserId?: string) => {
  //We reuse the existing visibility checks without increasing the view count again.
  const propertyBySlug = await getPropertyBySlug(slug, currentUserId, false);

  if (!propertyBySlug) {
    throw new NotFoundError("Property not found!");
  }

  const { latitude, longitude } = propertyBySlug;

  //Zero is a valid coordinate, so we do not use a truthiness check here.
  const hasValidLocation =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  //Featured and non-featured recommendations must be within the same radius.
  //We can change this value to increase or decrease the recommendation area.
  const similarPropertyRadiusInKm = 10;

  //We calculate distance only when the current property has valid coordinates.
  //Otherwise, we will recommend featured properties without a distance condition.
  const distanceInMetres = hasValidLocation
    ? sql<number>`
      ST_Distance(
        CASE
          WHEN ${address.latitude} BETWEEN -90 AND 90
           AND ${address.longitude} BETWEEN -180 AND 180
          THEN ST_SetSRID(
            ST_MakePoint(${address.longitude}, ${address.latitude}), 4326
          )::geography
          ELSE NULL::geography
        END,
        ST_SetSRID(
          ST_MakePoint(${longitude}, ${latitude}), 4326
        )::geography
      )
    `
    : undefined;

  const nowTodayInISOString = new Date().toISOString();

  //We return the complete listing details, including the fields our search cards display.
  const similarProperties = await db
    .select({
      //The common property listing fields.
      id: property.id,
      sellerId: property.sellerId,
      propertyTypeId: property.propertyTypeId,
      title: property.title,
      slug: property.slug,
      description: property.description,
      toRent: property.toRent,
      address: property.address,
      closeLandmark: property.closeLandmark,
      propertyType: property.propertyType,
      availableFrom: property.availableFrom,
      availableTill: property.availableTill,
      price: property.price,
      negotiable: property.negotiable,
      imageUrl: property.imageUrl,
      facilities: property.facilities,
      status: property.status,
      listedAt: property.listedAt,
      updatedAt: property.updatedAt,
      featured: property.featured,
      private: property.private,
      expiresOn: property.expiresOn,
      views: property.views,

      //The seller details already used on the property page.
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      profilePicUrl: user.profilePicUrl,

      //The address linked to the property listing.
      houseNumber: address.houseNumber,
      street: address.street,
      wardNumber: address.wardNumber,
      municipality: address.municipality,
      city: address.city,
      district: address.district,
      province: address.province,
      latitude: address.latitude,
      longitude: address.longitude,

      //The house details, using our existing property response names.
      houseType: house.houseType,
      roomCount: house.roomCount,
      floorCount: house.floorCount,
      kitchenCount: house.kitchenCount,
      sharedBathroom: house.sharedBathroom,
      bathroomCount: house.bathroomCount,
      houseFacing: house.facing,
      carParking: house.carParking,
      bikeParking: house.bikeParking,
      evCharging: house.evCharging,
      builtAt: house.builtAt,
      houseArea: house.area,
      furnished: house.furnished,
      houseConnectedToRoad: house.connectedToRoad,
      houseDistanceToRoad: house.distanceToRoad,

      //The land details, using our existing property response names.
      landType: land.landType,
      landArea: land.area,
      length: land.length,
      breadth: land.breadth,
      landConnectedToRoad: land.connectedToRoad,
      landDistanceToRoad: land.distanceToRoad
    })
    .from(property)
    .leftJoin(user, eq(property.sellerId, user.id))
    .leftJoin(address, eq(property.address, address.id))
    .leftJoin(house, eq(property.propertyTypeId, house.id))
    .leftJoin(land, eq(property.propertyTypeId, land.id))
    .where(
      and(
        //We exclude the current listing and match both property type and rent/sale.
        ne(property.id, propertyBySlug.id),
        eq(property.propertyType, propertyBySlug.propertyType),
        eq(property.toRent, propertyBySlug.toRent),
        eq(property.status, propertyBySlug.toRent ? "Rent" : "Sale"),

        //Only public, unexpired and currently available listings are suggested.
        eq(property.private, false),
        gt(property.expiresOn, nowTodayInISOString),
        lte(property.availableFrom, nowTodayInISOString),
        or(isNull(property.availableTill), gt(property.availableTill, nowTodayInISOString)),

        //When the current property has coordinates, all recommendations,
        //including featured properties, must be within the specified radius.
        //Otherwise, we return matching featured properties without a location filter.
        distanceInMetres !== undefined
          ? sql`${distanceInMetres} <= ${similarPropertyRadiusInKm * 1000}`
          : eq(property.featured, true)
      )
    )
    //Featured properties appear first, followed by non-featured properties.
    //Within each group, the closest properties appear first.
    //Without a location, the newest featured listings appear first.
    .orderBy(
      sql`${property.featured} DESC NULLS LAST`,
      ...(distanceInMetres !== undefined ? [asc(distanceInMetres)] : []),
      sql`${property.listedAt} DESC NULLS LAST`,
      asc(property.id)
    )
    .limit(6);

  //Our existing card expects an image array and a boolean featured value.
  return similarProperties.map((property) => ({
    ...property,
    imageUrl: property.imageUrl ?? [],
    featured: property.featured ?? false,
    street: property.street ?? ""
  }));
};

/**
 * @param userId  string - id of the current user from their session
 * @param filter  all, unexpired or expired listings
 * @param page    number - page of listings to return
 */
export const getMyProperties = async (
  userId: string,
  filter: "all" | "unexpired" | "expired",
  page: number
) => {
  const now = new Date().toISOString();
  const limit = 12;
  const [propertyCounts] = await preparedGetMyPropertyCounts.execute({ userId, now });
  const counts = {
    all: propertyCounts.all,
    expired: propertyCounts.expired,
    unexpired: propertyCounts.all - propertyCounts.expired
  };

  //If the last listing on a page was deleted, we return the previous page.
  const totalPages = Math.max(1, Math.ceil(counts[filter] / limit));
  const currentPage = Math.min(page, totalPages);
  const properties = await preparedGetMyProperties.execute({
    userId,
    filter,
    now,
    limit,
    offset: (currentPage - 1) * limit
  });

  return { properties, counts, page: currentPage, totalPages };
};
