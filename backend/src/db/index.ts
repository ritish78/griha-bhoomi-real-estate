import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
// const { Client } = pkg;

import {
  POSTGRES_URL,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_PORT,
  POSTGRES_POOL_MAX_SIZE,
  POSTGRES_IDLE_TIMEOUT_IN_MS,
  POSTGRES_CONN_TIMEOUT_IN_MS
} from "../config";

/**
 * In previous commit, we used "Client" to connect with Postgres.
 * When looking at benchmarks numbers, "Pool" is the better option.
 * Watch Hussein Nasersr explain: https://www.youtube.com/watch?v=GTeCtIoV2Tw
 */

const pool: pkg.Pool =
  process.env.NODE_ENV === "production"
    ? new Pool({ connectionString: POSTGRES_URL })
    : new Pool({
        host: POSTGRES_HOST,
        database: POSTGRES_DATABASE,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        port: POSTGRES_PORT,
        max: POSTGRES_POOL_MAX_SIZE, //size of the pool
        idleTimeoutMillis: POSTGRES_IDLE_TIMEOUT_IN_MS, //time a client will need to sit idle in the pool before it is disconnected from the database backend and discarded,
        connectionTimeoutMillis: POSTGRES_CONN_TIMEOUT_IN_MS //max time the pool will wait for a connection to be checked before throwing error
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

const db = drizzle(pool);

export default db;
