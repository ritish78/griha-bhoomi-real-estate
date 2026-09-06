"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.UsersRole = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const property_1 = require("./property");
//Role of the new user
exports.UsersRole = (0, pg_core_1.pgEnum)("user_role", ["ADMIN", "MODERATOR", "VIEWER"]);
/**
 * Creating table using drizzle. We are using postgres like
 * sql commands to create table. Also helps in type definitions.
 * If you make change to the below table or creating the table for the first time follow;
 * To create SQL command for this table, cd into backend folder terminal and type:
 * `pnpm run migration:generate`
 * To push the generated SQL command to Postgres, in the terminal type:
 * `pnpm run migration:push`
 * Or, to generate and push from the same command, in the terminal type:
 * `pnpm run migrate`
 */
exports.user = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    firstName: (0, pg_core_1.varchar)("first_name", { length: 30 }).notNull(),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 30 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    phone: (0, pg_core_1.varchar)("phone", { length: 10 }).unique(),
    dob: (0, pg_core_1.varchar)("dob", { length: 10 }).notNull(), //e.g. 2001-05-06
    bookmarks: (0, pg_core_1.uuid)("bookmarks")
        .references(() => property_1.property.id)
        .array(),
    bio: (0, pg_core_1.text)("bio"),
    profilePicUrl: (0, pg_core_1.text)("profile_pic_url"),
    secondEmail: (0, pg_core_1.varchar)("second_email", { length: 255 }),
    enabled: (0, pg_core_1.boolean)("enabled").default(true).notNull(), //The user is not banned
    verified: (0, pg_core_1.boolean)("verified").default(false).notNull(), //Email verification
    isAdmin: (0, pg_core_1.boolean)("is_admin").default(false).notNull(),
    isAgent: (0, pg_core_1.boolean)("is_agent").default(false).notNull(),
    role: (0, exports.UsersRole)("role").default("VIEWER").notNull(),
    lastActive: (0, pg_core_1.timestamp)("last_active").defaultNow(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow()
}, (table) => {
    return {
        emailIndex: (0, pg_core_1.index)("email_index").on(table.email)
    };
});
