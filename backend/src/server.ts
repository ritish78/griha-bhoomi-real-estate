import express from "express";
import cookies from "cookie-parser";
import cors from "cors";
import session from "express-session";
import RedisStore from "connect-redis";
import helmet from "helmet";

import redisClient from "./db/redis";

import { REDIS_SECRET } from "./config";

//import for routes
import authRoute from "./routes/api/auth";
import propertyRoute from "./routes/api/property";

const app = express();

import { errorHandler } from "./middleware/errorHandler";
import rateLimiter from "./middleware/rateLimiter";
//Database imports and connect to it
// import { connectToPostgresDB } from "./db";
// connectToPostgresDB();
redisClient.connect();

declare module "express-session" {
  interface SessionData {
    userId: string;
    email: string;
  }
}

app.use(helmet());
app.disable("X-Powered-By");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());
app.use(cors());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: REDIS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86_400 * 1000, //24 hours and in milliseconds
      httpOnly: false,
      secure: process.env.NODE_ENV === "production"
    }
  })
);

app.use(rateLimiter);

app.get("/api/v1/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/property", propertyRoute);

app.use(errorHandler);

export default app;
