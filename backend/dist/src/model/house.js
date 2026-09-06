"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.house = exports.HouseType = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.HouseType = (0, pg_core_1.pgEnum)("house_type", [
    "House",
    "Flat",
    "Shared",
    "Room",
    "Apartment",
    "Bungalow",
    "Villa"
]);
exports.house = (0, pg_core_1.pgTable)("house", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    houseType: (0, exports.HouseType)("house_type").notNull(),
    roomCount: (0, pg_core_1.smallint)("room_count").notNull(),
    floorCount: (0, pg_core_1.smallint)("floor_count").default(1).notNull(),
    kitchenCount: (0, pg_core_1.smallint)("kitchen_count").notNull(),
    sharedBathroom: (0, pg_core_1.boolean)("shared_bathroom").default(false).notNull(),
    bathroomCount: (0, pg_core_1.smallint)("bathroom_count").notNull(),
    facilities: (0, pg_core_1.text)("facilities"),
    area: (0, pg_core_1.varchar)("area", { length: 125 }),
    furnished: (0, pg_core_1.boolean)("furnished").default(false).notNull(),
    facing: (0, pg_core_1.varchar)("facing", { length: 125 }),
    carParking: (0, pg_core_1.smallint)("car_parking").notNull(),
    bikeParking: (0, pg_core_1.smallint)("bike_parking").notNull(),
    evCharging: (0, pg_core_1.boolean)("ev_charging").default(false).notNull(),
    builtAt: (0, pg_core_1.timestamp)("built_at", { mode: "string" }).notNull(),
    connectedToRoad: (0, pg_core_1.boolean)("connected_to_road").notNull(),
    distanceToRoad: (0, pg_core_1.smallint)("distance_to_road").notNull()
}, (table) => {
    return {
        houseTypeIndex: (0, pg_core_1.index)("house_type_index").on(table.houseType),
        roomCountIndex: (0, pg_core_1.index)("room_count_index").on(table.roomCount)
    };
});
