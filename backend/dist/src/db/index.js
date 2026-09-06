"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
// const { Client } = pkg;
const config_1 = require("../config");
/**
 * In previous commit, we used "Client" to connect with Postgres.
 * When looking at benchmarks numbers, "Pool" is the better option.
 * Watch Hussein Nasersr explain: https://www.youtube.com/watch?v=GTeCtIoV2Tw
 */
const pool = process.env.NODE_ENV === "production"
    ? new Pool({ connectionString: config_1.POSTGRES_URL })
    : new Pool({
        host: config_1.POSTGRES_HOST,
        database: config_1.POSTGRES_DATABASE,
        user: config_1.POSTGRES_USER,
        password: config_1.POSTGRES_PASSWORD,
        port: config_1.POSTGRES_PORT,
        max: config_1.POSTGRES_POOL_MAX_SIZE, //size of the pool
        idleTimeoutMillis: config_1.POSTGRES_IDLE_TIMEOUT_IN_MS, //time a client will need to sit idle in the pool before it is disconnected from the database backend and discarded,
        connectionTimeoutMillis: config_1.POSTGRES_CONN_TIMEOUT_IN_MS //max time the pool will wait for a connection to be checked before throwing error
    });
pool.on("connect", () => {
    console.log("Connected to Postgres Pool!");
});
pool.on("release", () => {
    console.log("Connection released!");
});
// const client: pkg.Client =
//   process.env.NODE_ENV === "production"
//     ? new Client({ connectionString: POSTGRES_URL })
//     : new Client({
//         host: POSTGRES_HOST,
//         database: POSTGRES_DATABASE,
//         user: POSTGRES_USER,
//         password: POSTGRES_PASSWORD,
//         port: POSTGRES_PORT
//       });
// export async function connectToPostgresDB() {
//   try {
//     console.log("Connecting to PostgreSQL. Won't take long!");
//     await client.connect();
//     console.log("Connected to PostgreSQL!");
//   } catch (error) {
//     console.error("Error while connecting to postgress!");
//     process.exit(1);
//   }
// }
// connectToPostgresDB();
// const db = drizzle(client);
const db = (0, node_postgres_1.drizzle)(pool, { logger: true });
exports.default = db;
