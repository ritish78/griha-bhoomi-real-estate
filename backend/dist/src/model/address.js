"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.address = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.address = (0, pg_core_1.pgTable)("address", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    houseNumber: (0, pg_core_1.varchar)("house_number", { length: 125 }),
    street: (0, pg_core_1.varchar)("street", { length: 255 }),
    wardNumber: (0, pg_core_1.smallint)("ward_number").notNull(),
    municipality: (0, pg_core_1.varchar)("municipality", { length: 125 }),
    city: (0, pg_core_1.varchar)("city", { length: 125 }).notNull(),
    district: (0, pg_core_1.varchar)("district", { length: 125 }).notNull(),
    province: (0, pg_core_1.varchar)("province", { length: 125 }).notNull(),
    latitude: (0, pg_core_1.real)("latitude"),
    longitude: (0, pg_core_1.real)("longitude"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull()
}, (table) => {
    return {
        municiplaityIndex: (0, pg_core_1.index)("municipality_index").on(table.municipality),
        cityIndex: (0, pg_core_1.index)("city_index").on(table.city),
        provinceIndex: (0, pg_core_1.index)("province_index").on(table.province)
    };
});
