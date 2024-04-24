import { InferSelectModel } from "drizzle-orm";
import { pgTable, pgEnum, index, uuid, varchar, boolean, smallint } from "drizzle-orm/pg-core";

export const LandType = pgEnum("land_type", ["plotting", "residential", "agricultural", "industrial"]);

export const land = pgTable(
  "land",
  {
    id: uuid("id").primaryKey(),
    landType: LandType("land_type").default("residential").notNull(),
    area: varchar("area", { length: 125 }).notNull(),
    length: varchar("length", { length: 125 }).notNull(),
    breadth: varchar("breadth", { length: 125 }).notNull(),
    connectedToRoad: boolean("connected_to_road").notNull(),
    distanceToRoad: smallint("distance_to_road").notNull()
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
