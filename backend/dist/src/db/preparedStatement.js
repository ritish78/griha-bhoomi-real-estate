"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparedDeleteAddress = exports.preparedDeleteBookmarkFromUser = exports.preparedAppendToBookmarkInUser = exports.preparedDeleteBookmark = exports.preparedGetBookmark = exports.preparedInsertBookmark = exports.preparedInsertAddress = exports.preparedDeletePropertyById = exports.preparedGetTotalNumberOfFeaturedProperties = exports.getTotalNumberOfProperties = exports.getListOfProperties = exports.preparedGetPropertyByKeyword = exports.preparedGetPropertyByFeaturedStatus = exports.preparedGetPropertyBySlug = exports.preparedGetPropertyById = exports.preparedDeleteLandById = exports.preparedInsertLand = exports.preparedDeleteHouseById = exports.preparedInsertHouse = exports.preparedInsertProperty = exports.preparedGetUserById = exports.preparedInsertUser = exports.preparedGetUserByEmail = void 0;
const _1 = __importDefault(require("."));
const drizzle_orm_1 = require("drizzle-orm");
const user_1 = require("src/model/user");
const property_1 = require("src/model/property");
const house_1 = require("src/model/house");
const land_1 = require("src/model/land");
const address_1 = require("src/model/address");
const bookmark_1 = require("src/model/bookmark");
/**
 * @params      email
 * @returns     User object of provided email
 */
exports.preparedGetUserByEmail = _1.default
    .select()
    .from(user_1.user)
    .where((0, drizzle_orm_1.eq)(user_1.user.email, drizzle_orm_1.sql.placeholder("email")))
    .limit(1)
    .prepare("get-user-by-email");
/**
 * @param firstName string - firstName of user
 * @param lastName  string - lastName of user
 * @param email     string - email of user
 * @param password  string - hashed password to login
 * @param phone     string - unique phone number
 * @param dob       string - date of birth in format YYYY-MM-DD
 * @returns         string - Promise to add new user to the database
 */
exports.preparedInsertUser = _1.default
    .insert(user_1.user)
    .values({
    firstName: drizzle_orm_1.sql.placeholder("firstName"),
    lastName: drizzle_orm_1.sql.placeholder("lastName"),
    email: drizzle_orm_1.sql.placeholder("email"),
    password: drizzle_orm_1.sql.placeholder("password"),
    phone: drizzle_orm_1.sql.placeholder("phone"),
    dob: drizzle_orm_1.sql.placeholder("dob"),
    bio: drizzle_orm_1.sql.placeholder("bio"),
    profilePicUrl: drizzle_orm_1.sql.placeholder("profilePicUrl"),
    secondEmail: drizzle_orm_1.sql.placeholder("secondEmail"),
    enabled: drizzle_orm_1.sql.placeholder("enabled"),
    verified: drizzle_orm_1.sql.placeholder("verified"),
    isAdmin: drizzle_orm_1.sql.placeholder("isAdmin"),
    isAgent: drizzle_orm_1.sql.placeholder("isAgent"),
    role: drizzle_orm_1.sql.placeholder("role")
})
    .prepare("insert-user");
/**
 * @params userId   string - ID of the user
 * @returns User    returns user of the provided id or []
 */
exports.preparedGetUserById = _1.default
    .select()
    .from(user_1.user)
    .where((0, drizzle_orm_1.eq)(user_1.user.id, drizzle_orm_1.sql.placeholder("userId")))
    .prepare("get-user-by-id");
/**
 * @param id              string - ID in uuid format of the to be inserted property
 * @param sellerId        string - ID in uuid format of the current user
 * @param propertyTypeId  string - ID in uuid format of the property type; HouseID or LandID
 * @param title           string - Title of the listing of the property
 * @param slug            string - Slug of the title
 * @param description     string - Description of the property
 * @param toRent          Boolean - Is property for rent?
 * @param address         string - Current implementation is to put address as a whole but need to create address table and add address to it and refer the address id instead on here
 * @param closeLandmark   string - Closest Landmark
 * @param propertyType    string - House | Flat | Apartment | Land | Building
 * @param availableFrom   string - Date in string from when the property is for sale or rent
 * @param availableTill   string - Date in string till the date where property is available
 * @param price           string - Price of the property
 * @param negotiable      Boolean - Is property negotiable
 * @param imageUrl        string[] - Array of image url
 * @param status          string - Sale | Hold | Sold
 * @param expiresOn       string - Date in string where the listing expires on the website
 * @returns               Promise to insert new property in database.
 */
exports.preparedInsertProperty = _1.default
    .insert(property_1.property)
    .values({
    id: drizzle_orm_1.sql.placeholder("id"),
    sellerId: drizzle_orm_1.sql.placeholder("sellerId"),
    propertyTypeId: drizzle_orm_1.sql.placeholder("propertyTypeId"),
    title: drizzle_orm_1.sql.placeholder("title"),
    slug: drizzle_orm_1.sql.placeholder("slug"),
    description: drizzle_orm_1.sql.placeholder("description"),
    toRent: drizzle_orm_1.sql.placeholder("toRent"),
    address: drizzle_orm_1.sql.placeholder("address"),
    closeLandmark: drizzle_orm_1.sql.placeholder("closeLandmark"),
    propertyType: drizzle_orm_1.sql.placeholder("propertyType"),
    availableFrom: drizzle_orm_1.sql.placeholder("availableFrom"),
    availableTill: drizzle_orm_1.sql.placeholder("availableTill"),
    price: drizzle_orm_1.sql.placeholder("price"),
    negotiable: drizzle_orm_1.sql.placeholder("negotiable"),
    imageUrl: [
        "https://placehold.co/600x400.png",
        "https://placehold.co/800x800.png",
        "https://placehold.co/1200x1000.png"
    ],
    // imageUrl: sql.placeholder("imageUrl"),
    status: drizzle_orm_1.sql.placeholder("status"),
    expiresOn: drizzle_orm_1.sql.placeholder("expiresOn"),
    views: 1
})
    .prepare("insert-property");
/**
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
 */
exports.preparedInsertHouse = _1.default
    .insert(house_1.house)
    .values({
    id: drizzle_orm_1.sql.placeholder("id"),
    houseType: drizzle_orm_1.sql.placeholder("houseType"),
    roomCount: drizzle_orm_1.sql.placeholder("roomCount"),
    floorCount: drizzle_orm_1.sql.placeholder("floorCount"),
    kitchenCount: drizzle_orm_1.sql.placeholder("kitchenCount"),
    sharedBathroom: drizzle_orm_1.sql.placeholder("sharedBathroom"),
    bathroomCount: drizzle_orm_1.sql.placeholder("bathroomCount"),
    facilities: drizzle_orm_1.sql.placeholder("facilities"),
    area: drizzle_orm_1.sql.placeholder("area"),
    furnished: drizzle_orm_1.sql.placeholder("furnished"),
    facing: drizzle_orm_1.sql.placeholder("facing"),
    carParking: drizzle_orm_1.sql.placeholder("carParking"),
    bikeParking: drizzle_orm_1.sql.placeholder("bikeParking"),
    evCharging: drizzle_orm_1.sql.placeholder("evCharging"),
    builtAt: drizzle_orm_1.sql.placeholder("builtAt"),
    connectedToRoad: drizzle_orm_1.sql.placeholder("connectedToRoad"),
    distanceToRoad: drizzle_orm_1.sql.placeholder("distanceToRoad")
})
    .prepare("insert-house");
/**
 * @param houseId           string - uuid of the house to delete
 */
exports.preparedDeleteHouseById = _1.default
    .delete(house_1.house)
    .where((0, drizzle_orm_1.eq)(house_1.house.id, drizzle_orm_1.sql.placeholder("houseId")))
    .prepare("delete-house");
/**
 * @param landType          string - plotting | residential | agricultural | industrial
 * @param area              string - area of the land
 * @param length            length - length of the land
 * @param breadth           breadth - length of the land
 * @param connectedToRoad   boolean - is land connected to road
 * @param distanceToRoad    number - distance from land to the road
 */
exports.preparedInsertLand = _1.default
    .insert(land_1.land)
    .values({
    id: drizzle_orm_1.sql.placeholder("id"),
    landType: drizzle_orm_1.sql.placeholder("landType"),
    area: drizzle_orm_1.sql.placeholder("area"),
    length: drizzle_orm_1.sql.placeholder("length"),
    breadth: drizzle_orm_1.sql.placeholder("breadth"),
    connectedToRoad: drizzle_orm_1.sql.placeholder("connectedToRoad"),
    distanceToRoad: drizzle_orm_1.sql.placeholder("distanceToRoad")
})
    .prepare("insert-house");
/**
 * @param landId          string - uuid of the land to delete
 */
exports.preparedDeleteLandById = _1.default
    .delete(land_1.land)
    .where((0, drizzle_orm_1.eq)(land_1.land.id, drizzle_orm_1.sql.placeholder("landId")))
    .prepare("delete-land");
/**
 * @param propertyId string - id of the property to fetch from postgres
 */
exports.preparedGetPropertyById = _1.default
    .select()
    .from(property_1.property)
    .where((0, drizzle_orm_1.eq)(property_1.property.id, drizzle_orm_1.sql.placeholder("propertyId")))
    .limit(1)
    .prepare("get-property-by-id");
/**
 * @param slug string - slug of the property to fetch from postgres
 */
exports.preparedGetPropertyBySlug = _1.default
    .select({
    id: property_1.property.id,
    sellerId: property_1.property.sellerId,
    firstName: user_1.user.firstName,
    lastName: user_1.user.lastName,
    phone: user_1.user.phone,
    profilePicUrl: user_1.user.profilePicUrl,
    title: property_1.property.title,
    slug: property_1.property.slug,
    description: property_1.property.description,
    toRent: property_1.property.toRent,
    closeLandmark: property_1.property.closeLandmark,
    propertyType: property_1.property.propertyType,
    availableFrom: property_1.property.availableFrom,
    availableTill: property_1.property.availableTill,
    price: property_1.property.price,
    negotiable: property_1.property.negotiable,
    imageUrl: property_1.property.imageUrl,
    status: property_1.property.status,
    listedAt: property_1.property.listedAt,
    updatedAt: property_1.property.updatedAt,
    featured: property_1.property.featured,
    private: property_1.property.private,
    expiresOn: property_1.property.expiresOn,
    views: property_1.property.views,
    houseType: house_1.house.houseType,
    roomCount: house_1.house.roomCount,
    floorCount: house_1.house.floorCount,
    kitchenCount: house_1.house.kitchenCount,
    sharedBathroom: house_1.house.sharedBathroom,
    bathroomCount: house_1.house.bathroomCount,
    facilities: house_1.house.facilities,
    houseFacing: house_1.house.facing,
    carParking: house_1.house.carParking,
    bikeParking: house_1.house.bikeParking,
    evCharging: house_1.house.evCharging,
    builtAt: house_1.house.builtAt,
    houseArea: house_1.house.area,
    furnished: house_1.house.furnished,
    houseConnectedToRoad: house_1.house.connectedToRoad,
    houseDistanceToRoad: house_1.house.distanceToRoad,
    landType: land_1.land.landType,
    landArea: land_1.land.area,
    length: land_1.land.length,
    breadth: land_1.land.breadth,
    landConnectedToRoad: land_1.land.connectedToRoad,
    landDistanceToRoad: land_1.land.distanceToRoad,
    houseNumber: address_1.address.houseNumber,
    street: address_1.address.street,
    wardNumber: address_1.address.wardNumber,
    municipality: address_1.address.municipality,
    city: address_1.address.city,
    district: address_1.address.district,
    province: address_1.address.province,
    latitude: address_1.address.latitude,
    longitude: address_1.address.longitude
})
    .from(property_1.property)
    .leftJoin(user_1.user, (0, drizzle_orm_1.eq)(property_1.property.sellerId, user_1.user.id))
    .leftJoin(address_1.address, (0, drizzle_orm_1.eq)(property_1.property.address, address_1.address.id))
    .leftJoin(house_1.house, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, house_1.house.id))
    .leftJoin(land_1.land, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, land_1.land.id))
    .where((0, drizzle_orm_1.eq)(property_1.property.slug, drizzle_orm_1.sql.placeholder("slug")))
    .limit(1)
    .prepare("get-property-by-slug");
const nowToday = new Date();
const nowTodayInISOString = nowToday.toISOString();
/**
 * @param limit   number - number of featured properties to fetch from database
 * @param offset  number - skip this many number of featured properties
 * @returns       Property[] where featured === true
 */
exports.preparedGetPropertyByFeaturedStatus = _1.default
    .select({
    id: property_1.property.id,
    title: property_1.property.title,
    slug: property_1.property.slug,
    description: property_1.property.description,
    toRent: property_1.property.toRent,
    propertyType: property_1.property.propertyType,
    price: property_1.property.price,
    imageUrl: property_1.property.imageUrl,
    status: property_1.property.status,
    featured: property_1.property.featured,
    views: property_1.property.views,
    street: address_1.address.street,
    municipality: address_1.address.municipality,
    city: address_1.address.municipality,
    district: address_1.address.district,
    roomCount: house_1.house.roomCount,
    bathroomCount: house_1.house.bathroomCount,
    houseArea: house_1.house.area,
    length: land_1.land.length,
    breadth: land_1.land.breadth,
    landArea: land_1.land.area
})
    .from(property_1.property)
    .leftJoin(address_1.address, (0, drizzle_orm_1.eq)(property_1.property.address, address_1.address.id))
    .leftJoin(house_1.house, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, house_1.house.id))
    .leftJoin(land_1.land, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, land_1.land.id))
    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(property_1.property.featured, true), (0, drizzle_orm_1.eq)(property_1.property.private, false), (0, drizzle_orm_1.gte)(property_1.property.expiresOn, nowTodayInISOString)))
    .orderBy((0, drizzle_orm_1.desc)(property_1.property.views))
    .limit(drizzle_orm_1.sql.placeholder("limit"))
    .offset(drizzle_orm_1.sql.placeholder("offset"))
    .prepare("get-featured-properties");
/**
 * @param keyword string - keyword to search the title and description
 */
exports.preparedGetPropertyByKeyword = (0, drizzle_orm_1.sql) `SELECT id, title, description, ts_rank(search_vector, to_tsquery('english', ${drizzle_orm_1.sql.placeholder("keyword")})) as rank FROM property WHERE search_vector @@ to_tsquery('english', ${drizzle_orm_1.sql.placeholder("keyword")}) ORDER BY rank desc;`;
/**
 * @param limit   number - number of properties to fetch from database
 * @param offset  number - skip this many number of properties
 * @returns       Property[]
 */
exports.getListOfProperties = _1.default
    .select({
    id: property_1.property.id,
    title: property_1.property.title,
    slug: property_1.property.slug,
    description: property_1.property.description,
    toRent: property_1.property.toRent,
    propertyType: property_1.property.propertyType,
    price: property_1.property.price,
    imageUrl: property_1.property.imageUrl,
    status: property_1.property.status,
    featured: property_1.property.featured,
    views: property_1.property.views,
    street: address_1.address.street,
    municipality: address_1.address.municipality,
    city: address_1.address.municipality,
    district: address_1.address.district,
    roomCount: house_1.house.roomCount,
    bathroomCount: house_1.house.bathroomCount,
    houseArea: house_1.house.area,
    length: land_1.land.length,
    breadth: land_1.land.breadth,
    landArea: land_1.land.area
})
    .from(property_1.property)
    .leftJoin(address_1.address, (0, drizzle_orm_1.eq)(property_1.property.address, address_1.address.id))
    .leftJoin(house_1.house, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, house_1.house.id))
    .leftJoin(land_1.land, (0, drizzle_orm_1.eq)(property_1.property.propertyTypeId, land_1.land.id))
    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(property_1.property.private, false), (0, drizzle_orm_1.gte)(property_1.property.expiresOn, nowTodayInISOString)))
    .orderBy((0, drizzle_orm_1.desc)(property_1.property.featured), (0, drizzle_orm_1.desc)(property_1.property.views), (0, drizzle_orm_1.desc)(property_1.property.listedAt))
    .limit(drizzle_orm_1.sql.placeholder("limit"))
    .offset(drizzle_orm_1.sql.placeholder("offset"))
    .prepare("get-number-of-properties");
/**
 * @returns   number - count of the total number of properties in the database
 */
exports.getTotalNumberOfProperties = _1.default
    .select({ count: (0, drizzle_orm_1.count)() })
    .from(property_1.property)
    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(property_1.property.private, false), (0, drizzle_orm_1.gte)(property_1.property.expiresOn, nowTodayInISOString)))
    .prepare("get-count-of-properties");
/**
 * @returns   number - count of the total number of featured properties in the database
 */
exports.preparedGetTotalNumberOfFeaturedProperties = _1.default
    .select({ count: (0, drizzle_orm_1.count)() })
    .from(property_1.property)
    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(property_1.property.private, false), (0, drizzle_orm_1.gte)(property_1.property.expiresOn, nowTodayInISOString), (0, drizzle_orm_1.eq)(property_1.property.featured, true)))
    .prepare("get-count-of-featured-properties");
/**
 * @param propertyId    string - property id to delete
 */
exports.preparedDeletePropertyById = _1.default
    .delete(property_1.property)
    .where((0, drizzle_orm_1.eq)(property_1.property.id, drizzle_orm_1.sql.placeholder("propertyId")))
    .prepare("delete-property-by-id");
/**
 * @param id                string - uuid of the address to insert
 * @param houseNumber       string - house number
 * @param street            string - name of the street
 * @param wardNumber        number - ward number
 * @param municipality      string - name of the municipality
 * @param city              string - name of the city
 * @param district          string - name of the district
 * @param province          string - name of the province
 * @param latitude          number - latitude
 * @param longitude         number - longitude
 */
exports.preparedInsertAddress = _1.default
    .insert(address_1.address)
    .values({
    id: drizzle_orm_1.sql.placeholder("id"),
    houseNumber: drizzle_orm_1.sql.placeholder("houseNumber"),
    street: drizzle_orm_1.sql.placeholder("street"),
    wardNumber: drizzle_orm_1.sql.placeholder("wardNumber"),
    municipality: drizzle_orm_1.sql.placeholder("municipality"),
    city: drizzle_orm_1.sql.placeholder("city"),
    district: drizzle_orm_1.sql.placeholder("district"),
    province: drizzle_orm_1.sql.placeholder("province"),
    latitude: drizzle_orm_1.sql.placeholder("latitude"),
    longitude: drizzle_orm_1.sql.placeholder("longitude")
})
    .prepare("insert-address");
/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
exports.preparedInsertBookmark = _1.default
    .insert(bookmark_1.bookmark)
    .values({
    userId: drizzle_orm_1.sql.placeholder("userId"),
    propertyId: drizzle_orm_1.sql.placeholder("propertyId")
})
    .prepare("insert-bookmark");
/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
exports.preparedGetBookmark = _1.default
    .select()
    .from(bookmark_1.bookmark)
    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookmark_1.bookmark.userId, drizzle_orm_1.sql.placeholder("userId")), (0, drizzle_orm_1.eq)(bookmark_1.bookmark.propertyId, drizzle_orm_1.sql.placeholder("propertyId"))))
    .prepare("get-bookmark");
/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
exports.preparedDeleteBookmark = _1.default
    .delete(bookmark_1.bookmark)
    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(bookmark_1.bookmark.userId, drizzle_orm_1.sql.placeholder("userId")), (0, drizzle_orm_1.eq)(bookmark_1.bookmark.propertyId, drizzle_orm_1.sql.placeholder("propertyId"))))
    .prepare("delete-bookmark");
/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
exports.preparedAppendToBookmarkInUser = _1.default
    .update(user_1.user)
    .set({ bookmarks: (0, drizzle_orm_1.sql) `array_append(bookmarks, ${drizzle_orm_1.sql.placeholder("propertyId")})` })
    .where((0, drizzle_orm_1.eq)(user_1.user.id, drizzle_orm_1.sql.placeholder("userId")))
    .prepare("append-bookmark-in-user");
/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
exports.preparedDeleteBookmarkFromUser = _1.default
    .update(user_1.user)
    .set({ bookmarks: (0, drizzle_orm_1.sql) `array_remove(bookmarks, ${drizzle_orm_1.sql.placeholder("propertyId")})` })
    .where((0, drizzle_orm_1.eq)(user_1.user.id, drizzle_orm_1.sql.placeholder("userId")))
    .prepare("delete-bookmark-in-user");
/**
 * @param addressId     string - uuid of the address to delete
 */
exports.preparedDeleteAddress = _1.default
    .delete(address_1.address)
    .where((0, drizzle_orm_1.eq)(address_1.address.id, drizzle_orm_1.sql.placeholder("addressId")))
    .prepare("delete-address");
