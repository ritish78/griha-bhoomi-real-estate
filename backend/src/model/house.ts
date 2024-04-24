import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  index,
  uuid,
  varchar,
  text,
  boolean,
  smallint,
  timestamp
} from "drizzle-orm/pg-core";

export const HouseType = pgEnum("house_type", [
  "House",
  "Flat",
  "Shared",
  "Room",
  "Apartment",
  "Bungalow",
  "Villa"
]);

export const house = pgTable(
  "house",
  {
    id: uuid("id").primaryKey(),
    houseType: HouseType("house_type").notNull(),
    roomCount: smallint("room_count").notNull(),
    floorCount: smallint("floor_count").default(1).notNull(),
    kitchenCount: smallint("kitchen_count").notNull(),
    sharedBathroom: boolean("shared_bathroom").default(false).notNull(),
    bathroomCount: smallint("bathroom_count").notNull(),
    facilities: text("facilities"),
    area: varchar("area", { length: 125 }),
    furnished: boolean("furnished").default(false).notNull(),
    facing: varchar("facing", { length: 125 }),
    carParking: smallint("car_parking").notNull(),
    bikeParking: smallint("bike_parking").notNull(),
    evCharging: boolean("ev_charging").default(false).notNull(),
    builtAt: timestamp("built_at", { mode: "string" }).notNull(),
    connectedToRoad: boolean("connected_to_road").notNull(),
    distanceToRoad: smallint("distance_to_road").notNull()
  },
  (table) => {
    return {
      houseTypeIndex: index("house_type_index").on(table.houseType),
      roomCountIndex: index("room_count_index").on(table.roomCount)
    };
  }
);

export type House = InferSelectModel<typeof house>;
