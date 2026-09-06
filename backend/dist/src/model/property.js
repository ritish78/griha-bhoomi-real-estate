"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.property = exports.PropertyStatus = exports.PropertyType = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
const address_1 = require("./address");
// import { tsvector } from "src/utils/tsvector";
exports.PropertyType = (0, pg_core_1.pgEnum)("property_type", ["House", "Land"]);
exports.PropertyStatus = (0, pg_core_1.pgEnum)("property_status", ["Sale", "Rent", "Hold", "Sold"]);
/**
 * Creating a table of name property. It is the listing of
 * property for sale. If you want to make table for social media
 * you can change table name to `posts` or if you are building
 * website for an e-commerce store,
 * you can change table name to `products`
 */
exports.property = (0, pg_core_1.pgTable)("property", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    sellerId: (0, pg_core_1.uuid)("seller_id").references(() => user_1.user.id, { onDelete: "cascade" }),
    propertyTypeId: (0, pg_core_1.uuid)("property_type_id").notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    toRent: (0, pg_core_1.boolean)("to_rent").notNull(),
    address: (0, pg_core_1.uuid)("address").references(() => address_1.address.id),
    closeLandmark: (0, pg_core_1.varchar)("close_landmark", { length: 255 }),
    propertyType: (0, exports.PropertyType)("property_type").default("House").notNull(),
    availableFrom: (0, pg_core_1.timestamp)("available_from", { mode: "string" }).notNull(),
    availableTill: (0, pg_core_1.timestamp)("available_till", { mode: "string" }),
    price: (0, pg_core_1.integer)("price").notNull(),
    negotiable: (0, pg_core_1.boolean)("negotiable").default(false).notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").array(),
    status: (0, exports.PropertyStatus)("status").default("Sale").notNull(),
    listedAt: (0, pg_core_1.timestamp)("listed_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
    featured: (0, pg_core_1.boolean)("featured").default(false),
    private: (0, pg_core_1.boolean)("private").default(false),
    expiresOn: (0, pg_core_1.timestamp)("expires_on", { mode: "string" }).notNull(),
    views: (0, pg_core_1.integer)("views").default(1).notNull()
    // searchVector: tsvector("search_vector", {
    //   sources: ["title", "description", "address", "close_landmark"]
    // })
}, (table) => {
    return {
        sellerIndex: (0, pg_core_1.index)("seller_id_index").on(table.sellerId),
        closeLandmarkIndex: (0, pg_core_1.index)("landmark_index").on(table.closeLandmark),
        titleIndex: (0, pg_core_1.index)("title_index").on(table.title),
        availableFromIndex: (0, pg_core_1.index)("availbe_from_index").on(table.availableFrom),
        featuredIndex: (0, pg_core_1.index)("featured_index").on(table.featured),
        addressIndex: (0, pg_core_1.index)("address_index").on(table.address),
        priceIndex: (0, pg_core_1.index)("price_index").on(table.price),
        propertyTypeIndex: (0, pg_core_1.index)("property_type_index").on(table.propertyType)
    };
});
