import { InferSelectModel } from "drizzle-orm";
import { pgTable, index, uuid, varchar, timestamp, smallint, real, customType } from "drizzle-orm/pg-core";

/**
 * In SQL:
 * location geometry(Point, 4326)
 *
 * 4326 is a Spatial Reference ID. It is a numeric code that identifies which
 * coordinate system we are using to interpret our coordinates.
 * 4326 is used by openstreetmap
 */
const geometry = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return "geometry(Point, 4326)";
  }
});

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
    location: geometry("location"), //Our custom PostGIS column
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => {
    return {
      municipalityIndex: index("municipality_index").on(table.municipality),
      cityIndex: index("city_index").on(table.city),
      provinceIndex: index("province_index").on(table.province),
      locationIndex: index("location_index").on(table.location)
    };
  }
);

export type Address = InferSelectModel<typeof address>;
