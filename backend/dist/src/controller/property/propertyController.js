"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePropertyPrivate = exports.updatePropertyById = exports.deletePropertyById = exports.getListOfFeaturedPropertiesByPagination = exports.getListOfPropertiesByPagination = exports.searchPropertyByKeyword = exports.filterProperties = exports.getPropertyBySlug = exports.getPropertyById = exports.addLand = exports.addHouse = exports.addProperty = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const slugify_1 = __importDefault(require("slugify"));
const uuid_1 = require("uuid");
const config_1 = require("src/config");
const db_1 = __importDefault(require("src/db"));
const preparedStatement_1 = require("src/db/preparedStatement");
const property_1 = require("src/model/property");
const logger_1 = __importDefault(require("src/utils/logger"));
const isAdmin_1 = require("src/utils/isAdmin");
const validateRequest_1 = require("src/middleware/validateRequest");
const house_1 = require("src/model/house");
const land_1 = require("src/model/land");
const addressController_1 = require("../address/addressController");
const address_1 = require("src/model/address");
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
const addProperty = (sellerId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, toRent, address, closeLandmark, propertyType, availableFrom, availableTill, price, negotiable, imageUrl, status, houseType, roomCount, floorCount, kitchenCount, sharedBathroom, bathroomCount, facilities, facing, area, furnished, carParking, bikeParking, evCharging, builtAt, connectedToRoad, distanceToRoad, landType, length, breadth, houseNumber, street, wardNumber, municipality, city, district, province, latitude, longitude } = body;
        console.log("Image URL", imageUrl);
        console.log("Image URL", imageUrl);
        console.log("Image URL", imageUrl);
        console.log("Image URL", imageUrl);
        console.log("Image URL", imageUrl);
        console.log("Image URL", imageUrl);
        const idOfToBeInsertedProperty = (0, uuid_1.v4)();
        let propertyTypeId;
        if (propertyType.toUpperCase() === "HOUSE") {
            propertyTypeId = yield (0, exports.addHouse)(houseType, roomCount, floorCount, kitchenCount, sharedBathroom, bathroomCount, facilities, furnished, area, facing, carParking, bikeParking, evCharging, builtAt, connectedToRoad, distanceToRoad);
        }
        else if (propertyType.toUpperCase() === "LAND") {
            propertyTypeId = yield (0, exports.addLand)(landType, area, length, breadth, connectedToRoad, distanceToRoad);
        }
        const addressId = yield (0, addressController_1.addAddress)(houseNumber, street, wardNumber, municipality, city, district, province, latitude, longitude);
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        yield preparedStatement_1.preparedInsertProperty.execute({
            id: idOfToBeInsertedProperty,
            sellerId,
            propertyTypeId: propertyTypeId,
            title,
            slug: `${idOfToBeInsertedProperty.split("-")[0]}-${(0, slugify_1.default)(title, { lower: true })}`,
            description,
            toRent,
            address: addressId,
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
        logger_1.default.info("Added new property", {
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
        }, true);
        //Even though the variable is named `idOfTheToBeInsertedProperty`, once we reach here
        //it is id of inserted property and still the same uuidv4 string
        return idOfToBeInsertedProperty;
    }
    catch (error) {
        logger_1.default.error(`${error.message} - (${new Date().toISOString()})`, {
            error: error.message,
            stack: error.stack
        });
    }
});
exports.addProperty = addProperty;
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
const addHouse = (houseType, roomCount, floorCount, kitchenCount, sharedBathroom, bathroomCount, facilities, furnished, area, facing, carParking, bikeParking, evCharging, builtAt, connectedToRoad, distanceToRoad) => __awaiter(void 0, void 0, void 0, function* () {
    const idOfToBeInsertedHouse = (0, uuid_1.v4)();
    yield preparedStatement_1.preparedInsertHouse.execute({
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
        distanceToRoad: connectedToRoad ? 0 : distanceToRoad
    });
    return idOfToBeInsertedHouse;
});
exports.addHouse = addHouse;
/**
 * @param landType          string - plotting | residential | agricultural | industrial
 * @param area              string - area of the land
 * @param length            length - length of the land
 * @param breadth           breadth - length of the land
 * @param connectedToRoad   boolean - is land connected to road
 * @param distanceToRoad    number - distance from land to the road
 * @returns
 */
const addLand = (landType, area, length, breadth, connectedToRoad, distanceToRoad) => __awaiter(void 0, void 0, void 0, function* () {
    const idOfToBeInsertedLand = (0, uuid_1.v4)();
    yield preparedStatement_1.preparedInsertLand.execute({
        id: idOfToBeInsertedLand,
        landType,
        area,
        length,
        breadth,
        connectedToRoad,
        distanceToRoad: connectedToRoad ? 0 : distanceToRoad
    });
    return idOfToBeInsertedLand;
});
exports.addLand = addLand;
/**
 * @param propertyId  string - property id of the searched property
 * @param userId      string | undefined - user id if signed in or undefined if not signed in
 * @returns           Property
 */
const getPropertyById = (propertyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Searching for property of id:", propertyId);
    const [propertyById] = (yield preparedStatement_1.preparedGetPropertyById.execute({ propertyId }));
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
            yield increaseViewOfProperty(propertyById);
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
        const currentUserIsAdmin = yield (0, isAdmin_1.isAdmin)(userId);
        //if current user is the seller or an admin. If it satisfies one of the
        //condition, we then return property without increasing the views
        if (propertyById.sellerId === userId || currentUserIsAdmin) {
            return propertyById;
        }
        else {
            //If the current user is not the seller or an admin and the property is
            //listed as private, then we return null
            return null;
        }
    }
    return null;
});
exports.getPropertyById = getPropertyById;
/**
 * @param slug  string - slug of the searched property
 * @returns     Property
 */
const getPropertyBySlug = (slug, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [propertyBySlug] = yield preparedStatement_1.preparedGetPropertyBySlug.execute({ slug });
    ///if property does not exists, we immediately return null back from the function
    if (!propertyBySlug) {
        return null;
    }
    if (!propertyBySlug.private && new Date(propertyBySlug.expiresOn) > new Date()) {
        //If the property listing hasn't expired and the property is not set to private
        //finally, we increase the view count of the property by one before returning property
        yield increaseViewOfProperty(propertyBySlug);
        return propertyBySlug;
    }
    //Similar to what we have implemented in the `getPropertyById` function
    if (propertyBySlug.private || new Date(propertyBySlug.expiresOn) < new Date()) {
        //If the user id is not supplied and the property is set to private or is expired,
        //we return null
        if (!userId) {
            return null;
        }
        const currentUserIsAdmin = yield (0, isAdmin_1.isAdmin)(userId);
        //if current user is the seller or an admin. If it satisfies one of the
        //condition, we then return property without increasing the views
        if (propertyBySlug.sellerId === userId || currentUserIsAdmin) {
            return propertyBySlug;
        }
        else {
            //If the current user is not the seller or an admin and the property is
            //listed as private, then we return null
            return null;
        }
    }
    //If the property listing is expired, then we return null.
    if (new Date(propertyBySlug.expiresOn) > new Date()) {
        return null;
    }
});
exports.getPropertyBySlug = getPropertyBySlug;
/**
 * @param filters   filters object from req.params
 * @returns         Properties[] or -1 if no filter is provided
 */
const filterProperties = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //These are the fields that the users can search. It can be queried from url
        //so we are not following camel case to name the fields. Users can just type
        //and search using the api without having to remember which letter to capitalize
        const validPropertiesFilterOptions = [
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
            "order"
        ];
        const validHouseFilterOptions = [
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
            "facilites",
            "area",
            "furnished",
            "facing",
            "carparking",
            "bikeparking",
            "evcharging",
            "builtat",
            "connectedtoroad",
            "distancetoroad"
        ];
        const validLandFilterOptions = [
            "landtype",
            "area",
            "length",
            "breadth",
            "connectedtoroad",
            "distancetoroad"
        ];
        const validAddressFilterOptions = [
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
            //The search query needs to be within the above `filterOptions`. User might search using `&test=ok`
            //and we might use it to query against the database. So, we only allow what can be queried
            //We also don't allow users to searches with same filter options twice in same request
            //Also if the user has provided the value for the query then only we take it for
            if (validPropertiesFilterOptions.includes(key) &&
                !mapPropertyFilterOptions.has(key) &&
                filters[key].trim()) {
                //We are skipping if `torent` or `negotiable` key is provided and something other than true or false is provided
                if ((key === "torent" || key === "negotiable") &&
                    !(filters[key] == "true" || filters[key] == "false")) {
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
            }
            else if (validHouseFilterOptions.includes(key) && !mapHouseFilterOptions.has(key)) {
                //Now to add filter options for house
                mapHouseFilterOptions.set(key, filters[key]);
                //If `connectedtoroad` and `distancetoroad` fields are provided in the context
                //of land, we add to it. We could simplify it by storing those two fields in
                //property table itself instead of having both fields on both House and Land table
                if (key === "connectedtoroad" || key === "distancetoroad") {
                    mapLandFilterOptions.set(key, filters[key]);
                }
            }
            else if (validLandFilterOptions.includes(key) && !mapLandFilterOptions.has(key)) {
                mapLandFilterOptions.set(key, filters[key]);
            }
            else if (validAddressFilterOptions.includes(key) && !mapAddressFilterOptions.has(key)) {
                mapAddressFilterOptions.set(key, filters[key]);
            }
        }
        //if the length of query is 0, that is user has only visited the page
        //we return -1 to the api route handler which will then redirect the user
        //to `/api/v1/property?page=1`
        if (mapPropertyFilterOptions.size === 0 &&
            mapHouseFilterOptions.size === 0 &&
            mapLandFilterOptions.size === 0 &&
            mapAddressFilterOptions.size === 0) {
            return -1;
        }
        //TODO: If the user provides `keyword` along with other fields of other tables
        //it is neglected. We need to make it search with other fields as well
        //if the filter is only one `keyword` then we return them with the function
        //that we have created below named `searchPropertyByKeyword`
        if (mapPropertyFilterOptions.size === 1 &&
            filters.keyword &&
            mapHouseFilterOptions.size === 0 &&
            mapLandFilterOptions.size === 0 &&
            mapAddressFilterOptions.size === 0) {
            const listOfProperties = yield (0, exports.searchPropertyByKeyword)(filters.keyword.trim(), (filters === null || filters === void 0 ? void 0 : filters.page) || 1);
            return listOfProperties;
        }
        const sortField = mapPropertyFilterOptions.get("sortby") || "views";
        const sortOrder = mapPropertyFilterOptions.get("sortby") && mapPropertyFilterOptions.get("order") == "asc" ? drizzle_orm_1.asc : drizzle_orm_1.desc;
        const nowToday = new Date();
        const nowTodayInISOString = nowToday.toISOString();
        //To get the number of filtered properties, we use one select() from dizzle where we
        //get the count and also the list of properties from where() clause.
        const filteredProperties = yield db_1.default
            .select({
            listOfProperties: property_1.property,
            numberOfFilteredProperties: (0, drizzle_orm_1.sql) `count(*) over()`
            // tsrank: sql`ts_rank(search_vector, to_tsquery('english', '${mapPropertyFilterOptions.get("keyword").replace(" ", " | ")}')) as rank`
        })
            .from(property_1.property)
            .leftJoin(address_1.address, (0, drizzle_orm_1.eq)(property_1.property.address, address_1.address.id))
            .leftJoin(house_1.house, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, house_1.house.id))
            .leftJoin(land_1.land, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, land_1.land.id))
            .where((0, drizzle_orm_1.and)(
        // mapPropertyFilterOptions.get("keyword")
        //   ? sql`search_vector @@ to_tsquery('english', '${mapPropertyFilterOptions.get("keyword").replace(" ", " | ")}')`
        //   : undefined,
        // TODO:
        // Currently, tsvector search is not implemented in Drizzle and the above method did not work
        // It is in progress and will be implemented soon. So, need to look back in the future when searching
        // using keyword like how it is implemented in `searchPropertyByKeyword`
        (0, drizzle_orm_1.eq)(property_1.property.private, false), (0, drizzle_orm_1.gte)(property_1.property.expiresOn, nowTodayInISOString), mapPropertyFilterOptions.get("keyword")
            ? (0, drizzle_orm_1.ilike)(property_1.property.title, `%${mapPropertyFilterOptions.get("keyword")}%`)
            : undefined, mapPropertyFilterOptions.get("torent")
            ? (0, drizzle_orm_1.eq)(property_1.property.toRent, mapPropertyFilterOptions.get("torent"))
            : undefined, mapPropertyFilterOptions.get("closelandmark")
            ? (0, drizzle_orm_1.ilike)(property_1.property.closeLandmark, `%${mapPropertyFilterOptions.get("closelandmark")}%`)
            : undefined, mapPropertyFilterOptions.get("propertytype")
            ? (0, drizzle_orm_1.eq)(property_1.property.propertyType, mapPropertyFilterOptions.get("propertytype"))
            : undefined, mapPropertyFilterOptions.get("availablefrom")
            ? (0, drizzle_orm_1.gte)(property_1.property.availableFrom, mapPropertyFilterOptions.get("availablefrom"))
            : undefined, mapPropertyFilterOptions.get("availabletill")
            ? (0, drizzle_orm_1.lte)(property_1.property.availableTill, mapPropertyFilterOptions.get("availabletill"))
            : undefined, mapPropertyFilterOptions.get("price")
            ? (0, drizzle_orm_1.eq)(property_1.property.price, mapPropertyFilterOptions.get("price"))
            : undefined, mapPropertyFilterOptions.get("minprice")
            ? (0, drizzle_orm_1.gte)(property_1.property.price, mapPropertyFilterOptions.get("minprice"))
            : undefined, mapPropertyFilterOptions.get("maxprice")
            ? (0, drizzle_orm_1.lte)(property_1.property.price, mapPropertyFilterOptions.get("maxprice"))
            : undefined, mapPropertyFilterOptions.get("pricerange")
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(property_1.property.price, mapPropertyFilterOptions.get("pricerange").split("-")[0]), (0, drizzle_orm_1.lte)(property_1.property.price, mapPropertyFilterOptions.get("pricerange").split("-")[1]))
            : undefined, mapPropertyFilterOptions.get("negotiable")
            ? (0, drizzle_orm_1.eq)(property_1.property.negotiable, mapPropertyFilterOptions.get("negotiable"))
            : undefined, mapPropertyFilterOptions.get("status")
            ? (0, drizzle_orm_1.eq)(property_1.property.status, mapPropertyFilterOptions.get("status"))
            : undefined, mapPropertyFilterOptions.get("listedat")
            ? (0, drizzle_orm_1.gte)(property_1.property.listedAt, mapPropertyFilterOptions.get("listedat"))
            : undefined, mapPropertyFilterOptions.get("updatedat")
            ? (0, drizzle_orm_1.gte)(property_1.property.updatedAt, mapPropertyFilterOptions.get("updatedat"))
            : undefined, 
        //Filtering options for House
        mapHouseFilterOptions.get("housetype")
            ? (0, drizzle_orm_1.eq)(house_1.house.houseType, mapHouseFilterOptions.get("housetype"))
            : undefined, mapHouseFilterOptions.get("roomcount")
            ? (0, drizzle_orm_1.eq)(house_1.house.roomCount, mapHouseFilterOptions.get("roomcount"))
            : undefined, mapHouseFilterOptions.get("minroomcount")
            ? (0, drizzle_orm_1.gte)(house_1.house.roomCount, mapHouseFilterOptions.get("minroomcount"))
            : undefined, mapHouseFilterOptions.get("maxroomcount")
            ? (0, drizzle_orm_1.lte)(house_1.house.roomCount, mapHouseFilterOptions.get("maxroomcount"))
            : undefined, mapHouseFilterOptions.get("roomcountrange")
            ? (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(house_1.house.roomCount, mapHouseFilterOptions.get("roomcountrange").split("-")[0]), (0, drizzle_orm_1.lte)(house_1.house.roomCount, mapHouseFilterOptions.get("roomcountrange").split("-")[1]))
            : undefined, mapHouseFilterOptions.get("floorcount")
            ? (0, drizzle_orm_1.eq)(house_1.house.floorCount, mapHouseFilterOptions.get("floorcount"))
            : undefined, mapHouseFilterOptions.get("minfloorcount")
            ? (0, drizzle_orm_1.gte)(house_1.house.floorCount, mapHouseFilterOptions.get("minfloorcount"))
            : undefined, mapHouseFilterOptions.get("maxfloorcount")
            ? (0, drizzle_orm_1.lte)(house_1.house.floorCount, mapHouseFilterOptions.get("maxfloorcount"))
            : undefined, mapHouseFilterOptions.get("kitchencount")
            ? (0, drizzle_orm_1.eq)(house_1.house.kitchenCount, mapHouseFilterOptions.get("kitchencount"))
            : undefined, mapHouseFilterOptions.get("minkitchencount")
            ? (0, drizzle_orm_1.gte)(house_1.house.kitchenCount, mapHouseFilterOptions.get("minkitchencount"))
            : undefined, mapHouseFilterOptions.get("maxkitchencount")
            ? (0, drizzle_orm_1.lte)(house_1.house.kitchenCount, mapHouseFilterOptions.get("maxkitchencount"))
            : undefined, mapHouseFilterOptions.get("sharedbathroom")
            ? (0, drizzle_orm_1.eq)(house_1.house.sharedBathroom, mapHouseFilterOptions.get("sharedbathroom"))
            : undefined, mapHouseFilterOptions.get("bathroomcount")
            ? (0, drizzle_orm_1.eq)(house_1.house.bathroomCount, mapHouseFilterOptions.get("bathroomcount"))
            : undefined, mapHouseFilterOptions.get("minbathroomcount")
            ? (0, drizzle_orm_1.gte)(house_1.house.bathroomCount, mapHouseFilterOptions.get("minbathroomcount"))
            : undefined, mapHouseFilterOptions.get("maxbathroomcount")
            ? (0, drizzle_orm_1.lte)(house_1.house.bathroomCount, mapHouseFilterOptions.get("maxbathroomcount"))
            : undefined, 
        // mapHouseFilterOptions.get("facilities")    //TODO: Filters are arrays
        // mapHouseFilterOptions.get("area")          //TODO: We have set area to be of type string
        //The area may or may not be of same unit. eg. meter square, square feet
        mapHouseFilterOptions.get("furnished")
            ? (0, drizzle_orm_1.eq)(house_1.house.furnished, mapHouseFilterOptions.get("furnished"))
            : undefined, mapHouseFilterOptions.get("facing")
            ? (0, drizzle_orm_1.eq)(house_1.house.facing, mapHouseFilterOptions.get("facing"))
            : undefined, mapHouseFilterOptions.get("carparking")
            ? (0, drizzle_orm_1.gte)(house_1.house.carParking, mapHouseFilterOptions.get("carparking"))
            : undefined, mapHouseFilterOptions.get("bikeparking")
            ? (0, drizzle_orm_1.gte)(house_1.house.bikeParking, mapHouseFilterOptions.get("bikeparking"))
            : undefined, mapHouseFilterOptions.get("evcharging")
            ? (0, drizzle_orm_1.eq)(house_1.house.evCharging, mapHouseFilterOptions.get("evcharging"))
            : undefined, 
        //To get the built at, if user only provides the year; we create
        //date object where it specifies the first day othe year and if
        //the user supplies date like; 2004-05-01, then we use it instead
        //of having to create a date object
        mapHouseFilterOptions.get("builtat")
            ? (0, drizzle_orm_1.gte)(house_1.house.builtAt, mapHouseFilterOptions.get("builtat").length > 4
                ? mapHouseFilterOptions.get("builtat")
                : new Date(mapHouseFilterOptions.get("builtat"), 0, 1))
            : undefined, mapHouseFilterOptions.get("connectedtoroad")
            ? (0, drizzle_orm_1.eq)(house_1.house.connectedToRoad, mapHouseFilterOptions.get("connectedtoroad"))
            : undefined, mapHouseFilterOptions.get("distancetoroad")
            ? (0, drizzle_orm_1.lte)(house_1.house.distanceToRoad, mapHouseFilterOptions.get("distancetoroad"))
            : undefined, 
        //Now, filtering options for Land
        mapLandFilterOptions.get("landtype")
            ? (0, drizzle_orm_1.eq)(land_1.land.landType, mapLandFilterOptions.get("landtype"))
            : undefined, 
        // mapLandFilterOptions.get("length")
        //TODO: Area, length and breadth are of type string
        mapLandFilterOptions.get("connectedtoroad")
            ? (0, drizzle_orm_1.eq)(land_1.land.connectedToRoad, mapLandFilterOptions.get("connectedToRoad"))
            : undefined, mapLandFilterOptions.get("distancetoroad")
            ? (0, drizzle_orm_1.lte)(land_1.land.distanceToRoad, mapLandFilterOptions.get("distancetoroad"))
            : undefined, 
        //Now filtering options for Address
        mapAddressFilterOptions.get("street")
            ? (0, drizzle_orm_1.ilike)(address_1.address.street, `%${mapAddressFilterOptions.get("street")}%`)
            : undefined, mapAddressFilterOptions.get("wardnumber")
            ? (0, drizzle_orm_1.eq)(address_1.address.wardNumber, mapAddressFilterOptions.get("wardnumber"))
            : undefined, mapAddressFilterOptions.get("municipality")
            ? (0, drizzle_orm_1.ilike)(address_1.address.municipality, `%${mapAddressFilterOptions.get("municipality")}%`)
            : undefined, mapAddressFilterOptions.get("city")
            ? (0, drizzle_orm_1.ilike)(address_1.address.city, `%${mapAddressFilterOptions.get("city")}%`)
            : undefined, mapAddressFilterOptions.get("district")
            ? (0, drizzle_orm_1.ilike)(address_1.address.district, `%${mapAddressFilterOptions.get("district")}%`)
            : undefined, mapAddressFilterOptions.get("province")
            ? (0, drizzle_orm_1.ilike)(address_1.address.province, `%${mapAddressFilterOptions.get("province")}%`)
            : undefined))
            .orderBy((0, drizzle_orm_1.desc)(property_1.property.featured), sortOrder(property_1.property[sortField]))
            .limit(config_1.PROPERTY_COUNT_LIMIT_PER_PAGE)
            .offset(Number(filters.page ? filters.page - 1 : 0) * config_1.PROPERTY_COUNT_LIMIT_PER_PAGE);
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
            numberOfPages: filteredProperties.length > 0
                ? Math.ceil(filteredProperties[0].numberOfFilteredProperties / config_1.PROPERTY_COUNT_LIMIT_PER_PAGE)
                : 0,
            listOfFilteredProperties: filteredProperties.length > 0 ? filteredProperties.map((result) => result.listOfProperties) : {}
        };
    }
    catch (error) {
        console.log("Error occurred while filtering results!");
    }
});
exports.filterProperties = filterProperties;
/**
 * @param keyword   string - keyword to search the title and description column in postgres
 * @returns         Property[] object
 */
const searchPropertyByKeyword = (keyword, offset) => __awaiter(void 0, void 0, void 0, function* () {
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
        //Here there are two database query which is inefficient. Will merge the `filterProperties` and this function
        //once searching by ts_vector gets implemented.
        const propertyByKeyword = yield db_1.default.execute((0, drizzle_orm_1.sql) `SELECT *, ts_rank(search_vector, to_tsquery('english', ${normalisedKeyword})) as rank FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword}) AND private=${false} AND expires_on >=${nowTodayInISOString} ORDER BY rank desc OFFSET ${(offset - 1) * 2} LIMIT ${2};`);
        const numberOfResults = yield db_1.default.execute((0, drizzle_orm_1.sql) `SELECT COUNT(*) FROM property WHERE search_vector @@ to_tsquery('english', ${normalisedKeyword}) AND private=${false} AND expires_on >=${nowTodayInISOString};`);
        console.log("Number of results: ", numberOfResults.rows[0].count);
        console.log("Number of results: ", numberOfResults.rows[0].count);
        console.log("Number of results: ", numberOfResults.rows[0].count);
        return {
            currentPage: Number(offset),
            numberOfPages: Math.ceil(numberOfResults.rows[0].count / 2),
            numberOfProperties: Number(numberOfResults.rows[0].count),
            properties: propertyByKeyword.rows
        };
    }
    catch (error) {
        logger_1.default.error(`${error.message} - (${new Date().toISOString()})`, {
            error: error.message,
            stack: error.stack
        });
    }
});
exports.searchPropertyByKeyword = searchPropertyByKeyword;
/**
 * @param offset    number - start position to fetch the property
 * @param limit     number - number of properties to fetch per call
 * @returns         Properties[]
 */
const getListOfPropertiesByPagination = (offset_1, ...args_1) => __awaiter(void 0, [offset_1, ...args_1], void 0, function* (offset, limit = config_1.PROPERTY_COUNT_LIMIT_PER_PAGE) {
    try {
        const listOfProperties = yield preparedStatement_1.getListOfProperties.execute({
            limit,
            offset
        });
        return listOfProperties;
    }
    catch (error) {
        logger_1.default.error(`${error.message} - (${new Date().toISOString()})`, {
            error: error.message,
            stack: error.stack
        });
    }
});
exports.getListOfPropertiesByPagination = getListOfPropertiesByPagination;
/**
 * @param offset    number - start position to fetch the property
 * @param limit     number - limit the number of featured properties to fetch from db
 * @returns         Properties[] where featured === true
 */
const getListOfFeaturedPropertiesByPagination = (offset, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listOfFeaturedProperties = yield preparedStatement_1.preparedGetPropertyByFeaturedStatus.execute({
            limit,
            offset
        });
        return listOfFeaturedProperties;
    }
    catch (error) {
        logger_1.default.error(`${error.message} - (${new Date().toISOString()})`, {
            error: error.message,
            stack: error.stack
        });
    }
});
exports.getListOfFeaturedPropertiesByPagination = getListOfFeaturedPropertiesByPagination;
/**
 * @param userId      string - id of the user that is sending delete request
 * @param propertyId  string - id of property to delete
 * @returns           1 if deleted successfully
 */
const deletePropertyById = (userId, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyById = yield (0, exports.getPropertyById)(propertyId, userId);
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
            yield deleteProperty(propertyById);
            return 1;
        }
        //Now if the user isn't the user who created the listing then it leaves
        //if the user is admin of some kind. If the user is admin, then we allow
        //them to delete the property listing
        const currentUserIsAdmin = yield (0, isAdmin_1.isAdmin)(userId);
        if (currentUserIsAdmin) {
            yield deleteProperty(propertyById);
            return 1;
        }
        //If the user who sent the delete request is neither an admin or moderator
        //and the user is not the same user who created the property listing
        //then we just skip it and throw ForbiddenError with status code 403 in the api handler
        return -1;
    }
    catch (error) {
        console.error("Error occurred while trying to delete property of id: ", propertyId);
        logger_1.default.error("Error deleting property", { userId, propertyId }, true);
    }
});
exports.deletePropertyById = deletePropertyById;
/**
 * @param propertyId                string - id of the property to update
 * @param currentUserId             string - id of the current user
 * @param propertyFieldsToUpdate    object - property fields to update
 * @returns                         0 if no property of provided id is found | 1 if updated succesfully | -1 if the user is not authorized to update property
 */
const updatePropertyById = (propertyId, currentUserId, propertyFieldsToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    const propertyById = yield (0, exports.getPropertyById)(propertyId, currentUserId);
    //If property by its id does not exists we return 0 which we will use in the api handler
    //to throw NotFoundError with the status code of 404.
    if (!propertyById) {
        return 0;
    }
    //The list contains what the user can update of the property listing.
    const validUpdatePropertyOptions = [
        "title",
        "description",
        "toRent",
        "closeLandmark",
        "availableFrom",
        "availableTill",
        "price",
        "negotiable",
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
    //We do the same for house table. We have fields that the user can update
    const validUpdateHouseOptions = [
        "houseType",
        "roomCount",
        "floorCount",
        "kitchenCount",
        "sharedBathroom",
        "bathroomCount",
        "facilities",
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
    const validUpdateLandOptions = [
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
    let houseOrLandUpdated = false;
    if (propertyById.propertyType.toUpperCase() === "HOUSE" && (0, validateRequest_1.hasHouseFields)(propertyFieldsToUpdate)) {
        yield updateHouseListingById(propertyById.propertyTypeId, validHouseFieldsToUpdate);
        houseOrLandUpdated = true;
    }
    else if (propertyById.propertyType.toUpperCase() === "LAND" && (0, validateRequest_1.hasLandFields)(propertyFieldsToUpdate)) {
        yield updateLandListingById(propertyById.propertyTypeId, validLandFieldsToUpdate);
        houseOrLandUpdated = true;
    }
    //If the property listing is created by the current user then we allow the update to happen
    if (propertyById.sellerId === currentUserId && Object.keys(validPropertyFieldsToUpdate).length > 0) {
        yield updatePropertyListingById(propertyId, validPropertyFieldsToUpdate);
        return 1;
    }
    /**
     * If we are checking property's seller id is same as the current user id in the previous statement
     * then we might also use is currentuseradmin checking on the same if statement.
     * That might mean second query to the database which might not be needed. We exit out on that
     * if statement if the current user is the user that is providing the update fields.
     */
    const currentUserIsAdmin = yield (0, isAdmin_1.isAdmin)(currentUserId);
    if (currentUserIsAdmin && Object.keys(validPropertyFieldsToUpdate).length > 0) {
        yield updatePropertyListingById(propertyId, propertyFieldsToUpdate);
        return 1;
    }
    //If the user who sent the request to update the property is neither the user who posted
    //the listing and isn't admin then we return -1 back to api handler where we throw
    //ForbiddenError with the status code of 403.
    return houseOrLandUpdated ? 1 : -1;
});
exports.updatePropertyById = updatePropertyById;
/**
 * @param propertyToDelete        Property - Property object that the user is intending to delete
 */
const deleteProperty = (propertyToDelete) => __awaiter(void 0, void 0, void 0, function* () {
    yield preparedStatement_1.preparedDeletePropertyById.execute({ propertyId: propertyToDelete.id });
    yield preparedStatement_1.preparedDeleteAddress.execute({ addressId: propertyToDelete.address });
    if (propertyToDelete.propertyType.toUpperCase() === "HOUSE") {
        yield preparedStatement_1.preparedDeleteHouseById.execute({ houseId: propertyToDelete.propertyTypeId });
    }
    else if (propertyToDelete.propertyType.toUpperCase() === "LAND") {
        yield preparedStatement_1.preparedDeleteLandById.execute({ landId: propertyToDelete.propertyTypeId });
    }
});
/**
 * @param propertyId                string - id of the property to update
 * @param propertyFieldsToUpdate    object - property fields to update
 * @returns                         Promise<void>
 */
const updatePropertyListingById = (propertyId, propertyFieldsToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    propertyFieldsToUpdate.updatedAt = new Date();
    yield db_1.default.update(property_1.property).set(propertyFieldsToUpdate).where((0, drizzle_orm_1.eq)(property_1.property.id, propertyId));
});
/**
 * @param houseId                   string - id of the house to update
 * @param houseFieldsToUpdate       object - house fields to update
 * @returns                         Promise<void>
 */
const updateHouseListingById = (houseId, houseFieldsToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.update(house_1.house).set(houseFieldsToUpdate).where((0, drizzle_orm_1.eq)(house_1.house.id, houseId));
});
/**
 * @param landId                    string - id of the land to update
 * @param landFieldsToUpdate        object - land fields to update
 * @returns                         Promise<void>
 */
const updateLandListingById = (landId, landFieldsToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.update(land_1.land).set(landFieldsToUpdate).where((0, drizzle_orm_1.eq)(land_1.land.id, landId));
});
/**
 * @param propertyToUpdate      Property - property to update
 */
const increaseViewOfProperty = (propertyToUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default
        .update(property_1.property)
        .set({ views: propertyToUpdate.views + 1 })
        .where((0, drizzle_orm_1.eq)(property_1.property.id, propertyToUpdate.id));
});
/**
 * @param propertyId      string - id of the property to set as private or remove as private
 * @param currentUserId   string - id of the current user
 */
const togglePropertyPrivate = (propertyId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const propertyById = yield (0, exports.getPropertyById)(propertyId, currentUserId);
    if (!propertyById) {
        return null;
    }
    //If the current user is the one who posted the property listing
    //we then allow to toggle the property private status
    if (propertyById.sellerId === currentUserId) {
        yield propertyPrivateToggleHandler(propertyById, propertyId);
        return true;
    }
    const currentUserIsAdmin = yield (0, isAdmin_1.isAdmin)(currentUserId);
    if (currentUserIsAdmin) {
        yield propertyPrivateToggleHandler(propertyById, propertyId);
        return true;
    }
    else {
        return null;
    }
});
exports.togglePropertyPrivate = togglePropertyPrivate;
/**
 * @param propertyById    Property - property to update the private status
 * @param propertyId      string - id of the property to update
 */
const propertyPrivateToggleHandler = (propertyById, propertyId) => __awaiter(void 0, void 0, void 0, function* () {
    const nowToday = new Date();
    yield db_1.default
        .update(property_1.property)
        .set({ private: !propertyById.private, updatedAt: nowToday })
        .where((0, drizzle_orm_1.eq)(property_1.property.id, propertyId));
});
