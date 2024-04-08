import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  index,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const PropertyType = pgEnum("property_type", ["House", "Flat", "Apartment", "Land", "Building"]);
export const PropertyStatus = pgEnum("property_status", ["Sale", "Hold", "Sold"]);

/**
 * Creating a table of name property. It is the listing of
 * property for sale. If you want to make table for social media
 * you can change table name to `posts` or if you are building
 * website for an e-commerce store,
 * you can change table name to `products`
 */
export const property = pgTable(
  "property",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => user.id),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull(),
    toRent: boolean("to_rent").notNull(),
    address: varchar("address", { length: 255 }),
    closeLandmark: varchar("close_landmark", { length: 255 }),
    propertyType: PropertyType("property_type").default("Flat").notNull(),
    availableFrom: timestamp("available_from", { mode: "string" }).notNull(),
    availableTill: timestamp("available_till", { mode: "string" }),
    price: varchar("price", { length: 12 }),
    negotiable: boolean("negotiable").default(false).notNull(),
    imageUrl: text("image_url"),
    status: PropertyStatus("status").default("Sale").notNull(),
    listedAt: timestamp("listed_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    featured: boolean("featured").default(false),
    expiresOn: timestamp("expires_on", { mode: "string" }),
    views: integer("views")
  },
  (table) => {
    return {
      sellerIndex: index("seller_id_index").on(table.sellerId),
      closeLandmarkIndex: index("landmark_index").on(table.closeLandmark),
      titleIndex: index("title_index").on(table.title),
      availableFromIndex: index("availbe_from_index").on(table.availableFrom),
      featuredIndex: index("featured_index").on(table.featured),
      addressIndex: index("address_index").on(table.address),
      priceIndex: index("price_index").on(table.price),
      PropertyType: index("property_type_index").on(table.propertyType)
    };
  }
);

export type Property = InferSelectModel<typeof property>;
