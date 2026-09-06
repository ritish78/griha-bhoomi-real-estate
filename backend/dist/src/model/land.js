"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.land = exports.LandType = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.LandType = (0, pg_core_1.pgEnum)("land_type", ["plotting", "residential", "agricultural", "industrial"]);
exports.land = (0, pg_core_1.pgTable)("land", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    landType: (0, exports.LandType)("land_type").default("residential").notNull(),
    area: (0, pg_core_1.varchar)("area", { length: 125 }).notNull(),
    length: (0, pg_core_1.varchar)("length", { length: 125 }).notNull(),
    breadth: (0, pg_core_1.varchar)("breadth", { length: 125 }).notNull(),
    connectedToRoad: (0, pg_core_1.boolean)("connected_to_road").notNull(),
    distanceToRoad: (0, pg_core_1.smallint)("distance_to_road").notNull()
}, (table) => {
    return {
        landTypeIndex: (0, pg_core_1.index)("land_type_index").on(table.landType),
        areaIndex: (0, pg_core_1.index)("area_index").on(table.area),
        connectedToRoadIndex: (0, pg_core_1.index)("connected_to_road_index").on(table.connectedToRoad)
    };
});
