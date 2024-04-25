import { InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { property } from "./property";
import { primaryKey } from "drizzle-orm/pg-core";

export const bookmark = pgTable(
  "bookmark",
  {
    userId: uuid("userId")
      .references(() => user.id)
      .notNull(),
    propertyId: uuid("propertyId")
      .references(() => property.id)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow()
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.propertyId] })
    };
  }
);

export type Bookmark = InferSelectModel<typeof bookmark>;
