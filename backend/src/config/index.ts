import dotenv from "dotenv";
dotenv.config();

//Express Config
export const EXPRESS_SERVER_PORT = process.env.EXPRESS_SERVER_PORT || 5000;

//Postgres Config
export const POSTGRES_URL = process.env.POSTGRES_URL;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_POOL_MAX_SIZE = Number(process.env.POSTGRES_POOL_MAX_SIZE);
export const POSTGRES_IDLE_TIMEOUT_IN_MS = Number(process.env.POSTGRES_IDLE_TIMEOUT_IN_MS);
export const POSTGRES_CONN_TIMEOUT_IN_MS = Number(process.env.POSTGRES_CONN_TIMEOUT_IN_MS);

//Salt Rounds
export const NUMBER_OF_SALT_ROUNDS = 10;

//Redis Config
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_SECRET = process.env.REDIS_SECRET || "";
export const REDIS_MAX_CONNECTION_RETRY = Number(process.env.REDIS_MAX_CONNECTION_RETRY);
export const REDIS_MIN_CONNECTION_DELAY_IN_MS = Number(process.env.REDIS_MIN_CONNECTION_DELAY_IN_MS);
export const REDIS_MAX_CONNECTION_DELAY_IN_MS = Number(process.env.REDIS_MAX_CONNECTION_DELAY_IN_MS);

//JWT Secrets
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;

//Rate Limit varaibles
export const WINDOW_SIZE_IN_SECONDS = Number(process.env.WINDOW_SIZE_IN_SECONDS);
export const MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE = Number(
  process.env.MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE
);
export const MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE = Number(
  process.env.MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE
);
