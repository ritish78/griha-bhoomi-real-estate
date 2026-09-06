"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./src/config");
exports.default = {
    driver: "pg",
    schema: "./src/model",
    out: "./src/drizzle",
    dbCredentials: {
        host: config_1.POSTGRES_HOST,
        port: config_1.POSTGRES_PORT,
        user: config_1.POSTGRES_USER,
        password: config_1.POSTGRES_PASSWORD,
        database: config_1.POSTGRES_DATABASE
    },
    //Print all messages/statements
    verbose: true,
    //Always ask for confirmation
    strict: true
};
