import { createClient } from "redis";

import {
  REDIS_URL,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_MAX_CONNECTION_RETRY,
  REDIS_MIN_CONNECTION_DELAY_IN_MS,
  REDIS_MAX_CONNECTION_DELAY_IN_MS
} from "src/config";

import logger from "src/utils/logger";

//reconnecting to redis incase connection is broken
const reconn_strategy = (retries: number): number | Error => {
  if (retries > REDIS_MAX_CONNECTION_RETRY) {
    logger.error("Too many retries to connect to Redis. Connection closed!");
    return new Error("Too many retries! Could not connect to Redis!");
  } else {
    const wait = Math.min(
      REDIS_MIN_CONNECTION_DELAY_IN_MS * Math.pow(2, retries),
      REDIS_MAX_CONNECTION_DELAY_IN_MS
    );
    logger.info(`waiting ${wait} milliseconds`);
    return wait;
  }
};

//Then we can create redis client which can interact with redis
const redisClient =
  REDIS_URL || process.env.NODE_ENV === "production"
    ? createClient({ url: REDIS_URL })
    : createClient({
        socket: {
          host: REDIS_HOST,
          port: REDIS_PORT,
          reconnectStrategy: reconn_strategy
        }
      });

redisClient.on("connect", () => {
  console.log("Connected to Redis!");
});

export default redisClient;
