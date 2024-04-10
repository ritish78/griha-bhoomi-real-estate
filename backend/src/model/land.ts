import { InferSelectModel } from "drizzle-orm";
import { pgTable, pgEnum, index, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { property } from "./property";

export const LandType = pgEnum("land_type", ["plotting", "residential", "agricultural", "industrial"]);

export const land = pgTable(
  "land",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id").references(() => property.id),
    landType: LandType("land_type").default("residential"),
    area: varchar("area", { length: 125 }),
    length: varchar("area", { length: 125 }),
    breadth: varchar("area", { length: 125 }),
    connectedToRoad: boolean("connected_to_road").notNull(),
    distanceToRoad: boolean("distance_to_road").notNull(),
    listedAt: timestamp("listed_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
  },
  (table) => {
    return {
      landTypeIndex: index("land_type_index").on(table.landType),
      areaIndex: index("area_index").on(table.area),
      connectedToRoadIndex: index("connected_to_road_index").on(table.connectedToRoad)
    };
  }
);

export type Land = InferSelectModel<typeof land>;
