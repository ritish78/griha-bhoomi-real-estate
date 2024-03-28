import dotenv  from "dotenv";
dotenv.config();
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client: Client = new Client({
    connectionString: process.env.POSTGRES_URL
})

