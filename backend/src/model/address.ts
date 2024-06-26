import { InferSelectModel } from "drizzle-orm";
import { pgTable, index, uuid, varchar, timestamp, smallint, real } from "drizzle-orm/pg-core";

export const address = pgTable(
  "address",
  {
    id: uuid("id").primaryKey(),
    houseNumber: varchar("house_number", { length: 125 }),
    street: varchar("street", { length: 255 }),
    wardNumber: smallint("ward_number").notNull(),
    municipality: varchar("municipality", { length: 125 }),
    city: varchar("city", { length: 125 }).notNull(),
    district: varchar("district", { length: 125 }).notNull(),
    province: varchar("province", { length: 125 }).notNull(),
    latitude: real("latitude"),
    longitude: real("longitude"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => {
    return {
      municiplaityIndex: index("municipality_index").on(table.municipality),
      cityIndex: index("city_index").on(table.city),
      provinceIndex: index("province_index").on(table.province)
    };
  }
);

export type Address = InferSelectModel<typeof address>;
