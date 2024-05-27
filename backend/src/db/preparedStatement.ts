import db from ".";
import { sql, eq, desc, count, and, gte } from "drizzle-orm";

import { user } from "src/model/user";
import { property } from "src/model/property";
import { house } from "src/model/house";
import { land } from "src/model/land";
import { address } from "src/model/address";
import { bookmark } from "src/model/bookmark";

/**
 * @params      email
 * @returns     User object of provided email
 */
export const preparedGetUserByEmail = db
  .select()
  .from(user)
  .where(eq(user.email, sql.placeholder("email")))
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
export const preparedInsertUser = db
  .insert(user)
  .values({
    firstName: sql.placeholder("firstName"),
    lastName: sql.placeholder("lastName"),
    email: sql.placeholder("email"),
    password: sql.placeholder("password"),
    phone: sql.placeholder("phone"),
    dob: sql.placeholder("dob"),
    bio: sql.placeholder("bio"),
    profilePicUrl: sql.placeholder("profilePicUrl"),
    secondEmail: sql.placeholder("secondEmail"),
    enabled: sql.placeholder("enabled"),
    verified: sql.placeholder("verified"),
    isAdmin: sql.placeholder("isAdmin"),
    isAgent: sql.placeholder("isAgent"),
    role: sql.placeholder("role")
  })
  .prepare("insert-user");

/**
 * @params userId   string - ID of the user
 * @returns User    returns user of the provided id or []
 */
export const preparedGetUserById = db
  .select()
  .from(user)
  .where(eq(user.id, sql.placeholder("userId")))
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
export const preparedInsertProperty = db
  .insert(property)
  .values({
    id: sql.placeholder("id"),
    sellerId: sql.placeholder("sellerId"),
    propertyTypeId: sql.placeholder("propertyTypeId"),
    title: sql.placeholder("title"),
    slug: sql.placeholder("slug"),
    description: sql.placeholder("description"),
    toRent: sql.placeholder("toRent"),
    address: sql.placeholder("address"),
    closeLandmark: sql.placeholder("closeLandmark"),
    propertyType: sql.placeholder("propertyType"),
    availableFrom: sql.placeholder("availableFrom"),
    availableTill: sql.placeholder("availableTill"),
    price: sql.placeholder("price"),
    negotiable: sql.placeholder("negotiable"),
    imageUrl: [
      "https://placehold.co/600x400.png",
      "https://placehold.co/800x800.png",
      "https://placehold.co/1200x1000.png"
    ],
    // imageUrl: sql.placeholder("imageUrl"),
    status: sql.placeholder("status"),
    expiresOn: sql.placeholder("expiresOn"),
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
export const preparedInsertHouse = db
  .insert(house)
  .values({
    id: sql.placeholder("id"),
    houseType: sql.placeholder("houseType"),
    roomCount: sql.placeholder("roomCount"),
    floorCount: sql.placeholder("floorCount"),
    kitchenCount: sql.placeholder("kitchenCount"),
    sharedBathroom: sql.placeholder("sharedBathroom"),
    bathroomCount: sql.placeholder("bathroomCount"),
    facilities: sql.placeholder("facilities"),
    area: sql.placeholder("area"),
    furnished: sql.placeholder("furnished"),
    facing: sql.placeholder("facing"),
    carParking: sql.placeholder("carParking"),
    bikeParking: sql.placeholder("bikeParking"),
    evCharging: sql.placeholder("evCharging"),
    builtAt: sql.placeholder("builtAt"),
    connectedToRoad: sql.placeholder("connectedToRoad"),
    distanceToRoad: sql.placeholder("distanceToRoad")
  })
  .prepare("insert-house");

/**
 * @param houseId           string - uuid of the house to delete
 */
export const preparedDeleteHouseById = db
  .delete(house)
  .where(eq(house.id, sql.placeholder("houseId")))
  .prepare("delete-house");

/**
 * @param landType          string - plotting | residential | agricultural | industrial
 * @param area              string - area of the land
 * @param length            length - length of the land
 * @param breadth           breadth - length of the land
 * @param connectedToRoad   boolean - is land connected to road
 * @param distanceToRoad    number - distance from land to the road
 */
export const preparedInsertLand = db
  .insert(land)
  .values({
    id: sql.placeholder("id"),
    landType: sql.placeholder("landType"),
    area: sql.placeholder("area"),
    length: sql.placeholder("length"),
    breadth: sql.placeholder("breadth"),
    connectedToRoad: sql.placeholder("connectedToRoad"),
    distanceToRoad: sql.placeholder("distanceToRoad")
  })
  .prepare("insert-house");

/**
 * @param landId          string - uuid of the land to delete
 */
export const preparedDeleteLandById = db
  .delete(land)
  .where(eq(land.id, sql.placeholder("landId")))
  .prepare("delete-land");

/**
 * @param propertyId string - id of the property to fetch from postgres
 */
export const preparedGetPropertyById = db
  .select()
  .from(property)
  .where(eq(property.id, sql.placeholder("propertyId")))
  .limit(1)
  .prepare("get-property-by-id");

/**
 * @param slug string - slug of the property to fetch from postgres
 */
export const preparedGetPropertyBySlug = db
  .select({
    id: property.id,
    sellerId: property.sellerId,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    profilePicUrl: user.profilePicUrl,
    title: property.title,
    slug: property.slug,
    description: property.description,
    toRent: property.toRent,
    closeLandmark: property.closeLandmark,
    propertyType: property.propertyType,
    availableFrom: property.availableFrom,
    availableTill: property.availableTill,
    price: property.price,
    negotiable: property.negotiable,
    imageUrl: property.imageUrl,
    status: property.status,
    listedAt: property.listedAt,
    updatedAt: property.updatedAt,
    featured: property.featured,
    private: property.private,
    expiresOn: property.expiresOn,
    views: property.views,
    houseType: house.houseType,
    roomCount: house.roomCount,
    floorCount: house.floorCount,
    kitchenCount: house.kitchenCount,
    sharedBathroom: house.sharedBathroom,
    bathroomCount: house.bathroomCount,
    facilities: house.facilities,
    houseFacing: house.facing,
    carParking: house.carParking,
    bikeParking: house.bikeParking,
    evCharging: house.evCharging,
    builtAt: house.builtAt,
    houseArea: house.area,
    furnished: house.furnished,
    houseConnectedToRoad: house.connectedToRoad,
    houesDistanceToRoad: house.distanceToRoad,
    landType: land.landType,
    landArea: land.area,
    length: land.length,
    breadth: land.breadth,
    landConnectedToRoad: land.connectedToRoad,
    landDistanceToRoad: land.distanceToRoad,
    houseNumber: address.houseNumber,
    street: address.street,
    wardNumber: address.wardNumber,
    municipality: address.municipality,
    city: address.city,
    district: address.district,
    province: address.province,
    latitude: address.latitude,
    longitude: address.longitude
  })
  .from(property)
  .leftJoin(user, eq(property.sellerId, user.id))
  .leftJoin(address, eq(property.address, address.id))
  .leftJoin(house, eq(property.propertyTypeId, house.id))
  .leftJoin(land, eq(property.propertyTypeId, land.id))
  .where(eq(property.slug, sql.placeholder("slug")))
  .limit(1)
  .prepare("get-property-by-slug");

const nowToday = new Date();
const nowTodayInISOString = nowToday.toISOString();

/**
 * @param limit   number - number of featured properties to fetch from database
 * @param offset  number - skip this many number of featured properties
 * @returns       Property[] where featured === true
 */
export const preparedGetPropertyByFeaturedStatus = db
  .select({
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    toRent: property.toRent,
    propertyType: property.propertyType,
    price: property.price,
    imageUrl: property.imageUrl,
    status: property.status,
    featured: property.featured,
    views: property.views,
    street: address.street,
    municipality: address.municipality,
    city: address.municipality,
    district: address.district,
    roomCount: house.roomCount,
    bathroomCount: house.bathroomCount,
    houseArea: house.area,
    length: land.length,
    breadth: land.breadth,
    landArea: land.area
  })
  .from(property)
  .leftJoin(address, eq(property.address, address.id))
  .leftJoin(house, eq(property.propertyTypeId, house.id))
  .leftJoin(land, eq(property.propertyTypeId, land.id))
  .where(
    and(
      eq(property.featured, true),
      eq(property.private, false),
      gte(property.expiresOn, nowTodayInISOString)
    )
  )
  .orderBy(desc(property.views))
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare("get-featured-properties");

/**
 * @param keyword string - keyword to search the title and description
 */
export const preparedGetPropertyByKeyword = sql`SELECT id, title, description, ts_rank(search_vector, to_tsquery('english', ${sql.placeholder("keyword")})) as rank FROM property WHERE search_vector @@ to_tsquery('english', ${sql.placeholder("keyword")}) ORDER BY rank desc;`;

/**
 * @param limit   number - number of properties to fetch from database
 * @param offset  number - skip this many number of properties
 * @returns       Property[]
 */
export const getListOfProperties = db
  .select({
    id: property.id,
    title: property.title,
    slug: property.slug,
    description: property.description,
    toRent: property.toRent,
    propertyType: property.propertyType,
    price: property.price,
    imageUrl: property.imageUrl,
    status: property.status,
    featured: property.featured,
    views: property.views,
    street: address.street,
    municipality: address.municipality,
    city: address.municipality,
    district: address.district,
    roomCount: house.roomCount,
    bathroomCount: house.bathroomCount,
    houseArea: house.area,
    length: land.length,
    breadth: land.breadth,
    landArea: land.area
  })
  .from(property)
  .leftJoin(address, eq(property.address, address.id))
  .leftJoin(house, eq(property.propertyTypeId, house.id))
  .leftJoin(land, eq(property.propertyTypeId, land.id))
  .where(and(eq(property.private, false), gte(property.expiresOn, nowTodayInISOString)))
  .orderBy(desc(property.featured), desc(property.views), desc(property.listedAt))
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare("get-number-of-properties");

/**
 * @returns   number - count of the total number of properties in the database
 */
export const getTotalNumberOfProperties = db
  .select({ count: count() })
  .from(property)
  .where(and(eq(property.private, false), gte(property.expiresOn, nowTodayInISOString)))
  .prepare("get-count-of-properties");

/**
 * @returns   number - count of the total number of featured properties in the database
 */
export const preparedGetTotalNumberOfFeaturedProperties = db
  .select({ count: count() })
  .from(property)
  .where(
    and(
      eq(property.private, false),
      gte(property.expiresOn, nowTodayInISOString),
      eq(property.featured, true)
    )
  )
  .prepare("get-count-of-featured-properties");

/**
 * @param propertyId    string - property id to delete
 */
export const preparedDeletePropertyById = db
  .delete(property)
  .where(eq(property.id, sql.placeholder("propertyId")))
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
export const preparedInsertAddress = db
  .insert(address)
  .values({
    id: sql.placeholder("id"),
    houseNumber: sql.placeholder("houseNumber"),
    street: sql.placeholder("street"),
    wardNumber: sql.placeholder("wardNumber"),
    municipality: sql.placeholder("municipality"),
    city: sql.placeholder("city"),
    district: sql.placeholder("district"),
    province: sql.placeholder("province"),
    latitude: sql.placeholder("latitude"),
    longitude: sql.placeholder("longitude")
  })
  .prepare("insert-address");

/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
export const preparedInsertBookmark = db
  .insert(bookmark)
  .values({
    userId: sql.placeholder("userId"),
    propertyId: sql.placeholder("propertyId")
  })
  .prepare("insert-bookmark");

/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
export const preparedGetBookmark = db
  .select()
  .from(bookmark)
  .where(
    and(
      eq(bookmark.userId, sql.placeholder("userId")),
      eq(bookmark.propertyId, sql.placeholder("propertyId"))
    )
  )
  .prepare("get-bookmark");

/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
export const preparedDeleteBookmark = db
  .delete(bookmark)
  .where(
    and(
      eq(bookmark.userId, sql.placeholder("userId")),
      eq(bookmark.propertyId, sql.placeholder("propertyId"))
    )
  )
  .prepare("delete-bookmark");

/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
export const preparedAppendToBookmarkInUser = db
  .update(user)
  .set({ bookmarks: sql`array_append(bookmarks, ${sql.placeholder("propertyId")})` })
  .where(eq(user.id, sql.placeholder("userId")))
  .prepare("append-bookmark-in-user");

/**
 * @param userId        string - uuid of the user who bookmarked the property listing
 * @param propertyId    string - uuid of the property
 */
export const preparedDeleteBookmarkFromUser = db
  .update(user)
  .set({ bookmarks: sql`array_remove(bookmarks, ${sql.placeholder("propertyId")})` })
  .where(eq(user.id, sql.placeholder("userId")))
  .prepare("delete-bookmark-in-user");

/**
 * @param addressId     string - uuid of the address to delete
 */
export const preparedDeleteAddress = db
  .delete(address)
  .where(eq(address.id, sql.placeholder("addressId")))
  .prepare("delete-address");
