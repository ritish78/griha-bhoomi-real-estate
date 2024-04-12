import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

/**
 * Creating a schema to check the environment variables.
 * If these fields, don't satisfy then Zod will throw error
 *
 */
const environmentVariableSchema = z.object({
  //Check for Node Environment
  NODE_ENV: z.enum(["development", "test", "production"]),
  //Check for Express config
  EXPRESS_ENV: z.string().trim().min(1),
  //Postgres URL and other environment variables for Postgres
  POSTGRES_URL: z.string().optional(),
  POSTGRES_HOST: z.string().trim().min(1),
  POSTGRES_PORT: z.number().positive().int(),
  POSTGRES_DATABASE: z.string().trim().min(1),
  POSTGRES_PASSWORD: z.string().trim().min(1),
  POSTGRES_USER: z.string().trim().min(1),
  POSTGRES_POOL_MAX_SIZE: z.number().gte(1),
  POSTGRES_IDLE_TIMEOUT_IN_MS: z.number().gte(1000),
  POSTGRES_CONN_TIMEOUT_IN_MS: z.number().gte(1000),

  //Redis URL and other environment variables for Redis
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().trim().min(1),
  REDIS_PORT: z.number().positive().int(),
  REDIS_SECRET: z.string().optional(),
  REDIS_MAX_CONNECTION_RETRY: z.number().positive().int(),
  REDIS_MIN_CONNECTION_DELAY_IN_MS: z.number().positive().int(),
  REDIS_MAX_CONNECTION_DELAY_IN_MS: z.number().positive().int(),

  //JWT and its tokens
  JWT_SECRET: z.string().trim().min(1),
  JWT_REFRESH_TOKEN: z.string().trim().min(1),
  JWT_ACCESS_TOKEN: z.string().trim().min(1),

  //Rate limit variables
  WINDOW_SIZE_IN_SECONDS: z.number().gte(30),
  MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE: z.number().gte(1),
  MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE: z.number().gte(1),

  //Number of properties in one page
  PROPERTY_COUNT_LIMIT_PER_PAGE: z.number().gte(5)
});

/**
 * Now, we load the environment variables
 */
try {
  environmentVariableSchema.parse(process.env);
} catch (error) {
  throw new Error("Please specify all environment variables");
}

type EnvSchemaType = z.infer<typeof environmentVariableSchema>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends EnvSchemaType {}
  }
}
