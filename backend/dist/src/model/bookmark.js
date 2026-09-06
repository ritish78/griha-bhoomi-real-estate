"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmark = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
const property_1 = require("./property");
const pg_core_2 = require("drizzle-orm/pg-core");
exports.bookmark = (0, pg_core_1.pgTable)("bookmark", {
    userId: (0, pg_core_1.uuid)("userId")
        .references(() => user_1.user.id, { onDelete: "cascade" })
        .notNull(),
    propertyId: (0, pg_core_1.uuid)("propertyId")
        .references(() => property_1.property.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow()
}, (table) => {
    return {
        pk: (0, pg_core_2.primaryKey)({ columns: [table.userId, table.propertyId] })
    };
});
