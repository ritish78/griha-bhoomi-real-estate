import db from ".";
import { sql, eq } from "drizzle-orm";

import { user } from "src/model/user";
import { property } from "src/model/property";

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
 * @param sellerId      string - ID in uuid format of the current user
 * @param title         string - Title of the listing of the property
 * @param slug          string - Slug of the title
 * @param description   string - Description of the property
 * @param toRent        Boolean - Is property for rent?
 * @param address       string - Current implementation is to put address as a whole but need to create address table and add address to it and refer the address id instead on here
 * @param closeLandmark string - Closest Landmark
 * @param propertyType  string - House | Flat | Apartment | Land | Building
 * @param availableFrom string - Date in string from when the property is for sale or rent
 * @param availableTill string - Date in string till the date where property is available
 * @param price         string - Price of the property
 * @param negotiable    Boolean - Is property negotiable
 * @param imageUrl      string[] - Array of image url
 * @param status        string - Sale | Hold | Sold
 * @param expiresOn     string - Date in string where the listing expires on the website
 * @returns             Promise to insert new property in database.
 */
export const preparedInsertProperty = db
  .insert(property)
  .values({
    sellerId: sql.placeholder("sellerId"),
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
      "https://placehold.co/600x400",
      "https://placehold.co/800x800",
      "https://placehold.co/1200x1000"
    ],
    // imageUrl: sql.placeholder("imageUrl"),
    status: sql.placeholder("status"),
    expiresOn: sql.placeholder("expiresOn"),
    views: 1
  })
  .prepare("insert-property");

export const preparedGetPropertyById = db
  .select()
  .from(property)
  .where(eq(property.id, sql.placeholder("propertyId")))
  .limit(1)
  .prepare("get-property-by-id");
