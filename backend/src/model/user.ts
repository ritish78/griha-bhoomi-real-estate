import { InferSelectModel } from "drizzle-orm";
import { pgTable, pgEnum, index, text, varchar, uuid, timestamp, boolean } from "drizzle-orm/pg-core";

//Role of the new user
export const UsersRole = pgEnum("user_role", ["ADMIN", "MODERATOR", "VIEWER"]);

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
export const user = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 30 }).notNull(),
    lastName: varchar("last_name", { length: 30 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    phone: varchar("phone", { length: 10 }).unique(),
    dob: varchar("dob", { length: 10 }).notNull(), //e.g. 2001-05-06
    bio: text("bio"),
    profilePicUrl: text("profile_pic_url"),
    secondEmail: varchar("second_email", { length: 255 }),
    enabled: boolean("enabled").default(true).notNull(), //The user is not banned
    verified: boolean("verified").default(false).notNull(), //Email verification
    isAdmin: boolean("is_admin").default(false).notNull(),
    isAgent: boolean("is_agent").default(false).notNull(),
    role: UsersRole("role").default("VIEWER").notNull(),
    lastActive: timestamp("last_active").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
  },
  (table) => {
    return {
      emailIndex: index("email_index").on(table.email)
    };
  }
);

export type User = InferSelectModel<typeof user>;
