import { InferSelectModel, sql } from "drizzle-orm";
import { check } from "drizzle-orm/pg-core";
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
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    location: geometry("location").notNull(), //Our custom PostGIS column
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => {
    return {
      municipalityIndex: index("municipality_index").on(table.municipality),
      cityIndex: index("city_index").on(table.city),
      provinceIndex: index("province_index").on(table.province),
      locationIndex: index("location_index").on(table.location),
      locationRequired: check(
        "address_location_required",
        sql`${table.latitude} IS NOT NULL
          AND ${table.longitude} IS NOT NULL
          AND ${table.location} IS NOT NULL`
      ),
      latitudeRange: check("address_latitude_range", sql`${table.latitude} BETWEEN -90 AND 90`),
      longitudeRange: check("address_longitude_range", sql`${table.longitude} BETWEEN -180 AND 180`),
      locationMatchesCoordinates: check(
        "address_location_matches_coordinates",
        sql`NOT ST_IsEmpty(${table.location})
          AND ST_X(${table.location}) = ${table.longitude}::double precision
          AND ST_Y(${table.location}) = ${table.latitude}::double precision`
      )
    };
  }
);

export type Address = InferSelectModel<typeof address>;
