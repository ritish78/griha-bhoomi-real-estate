import { z } from "zod";

const environmentVariableSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"])
});

try {
  environmentVariableSchema.parse(process.env);
} catch (error) {
  throw new Error("Please specify all environment variables!");
}

export const NODE_ENV = process.env.NODE_ENV;
