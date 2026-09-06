"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const zod_1 = require("zod");
/**
 * Creating a schema to check the environment variables.
 * If these fields, don't satisfy then Zod will throw error
 *
 */
const environmentVariableSchema = zod_1.z.object({
    //Check for Node Environment
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]),
    //Check for Express config
    EXPRESS_ENV: zod_1.z.string().trim().min(1),
    //Postgres URL and other environment variables for Postgres
    POSTGRES_URL: zod_1.z.string().optional(),
    POSTGRES_HOST: zod_1.z.string().trim().min(1),
    POSTGRES_PORT: zod_1.z.number().positive().int(),
    POSTGRES_DATABASE: zod_1.z.string().trim().min(1),
    POSTGRES_PASSWORD: zod_1.z.string().trim().min(1),
    POSTGRES_USER: zod_1.z.string().trim().min(1),
    POSTGRES_POOL_MAX_SIZE: zod_1.z.number().gte(1),
    POSTGRES_IDLE_TIMEOUT_IN_MS: zod_1.z.number().gte(1000),
    POSTGRES_CONN_TIMEOUT_IN_MS: zod_1.z.number().gte(1000),
    //Redis URL and other environment variables for Redis
    REDIS_URL: zod_1.z.string().optional(),
    REDIS_HOST: zod_1.z.string().trim().min(1),
    REDIS_PORT: zod_1.z.number().positive().int(),
    REDIS_SECRET: zod_1.z.string().optional(),
    REDIS_MAX_CONNECTION_RETRY: zod_1.z.number().positive().int(),
    REDIS_MIN_CONNECTION_DELAY_IN_MS: zod_1.z.number().positive().int(),
    REDIS_MAX_CONNECTION_DELAY_IN_MS: zod_1.z.number().positive().int(),
    //JWT and its tokens
    JWT_SECRET: zod_1.z.string().trim().min(1),
    JWT_REFRESH_TOKEN: zod_1.z.string().trim().min(1),
    JWT_ACCESS_TOKEN: zod_1.z.string().trim().min(1),
    //Rate limit variables
    WINDOW_SIZE_IN_SECONDS: zod_1.z.number().gte(30),
    MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE: zod_1.z.number().gte(1),
    MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE: zod_1.z.number().gte(1),
    //Number of properties in one page
    PROPERTY_COUNT_LIMIT_PER_PAGE: zod_1.z.number().gte(5)
});
/**
 * Now, we load the environment variables
 */
try {
    environmentVariableSchema.parse(process.env);
}
catch (error) {
    throw new Error("Please specify all environment variables!");
}
