import { Request, Response, NextFunction } from "express";
import redisClient from "src/db/redis";

/**
 * @param ttlSeconds    number - time in seconds to cache the response
 * @returns             Middleware to cache the response
 */
export const cache = (ttlSeconds: number) => async (req: Request, res: Response, next: NextFunction) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await redisClient.get(key);

  if (cached) {
    return res.send(JSON.parse(cached));
  }

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);

  res.json = (body) => {
    void redisClient.setEx(key, ttlSeconds, JSON.stringify(body));
    return originalJson(body);
  };

  res.send = (body) => {
    if (body && typeof body === "object" && !Buffer.isBuffer(body)) {
      void redisClient.setEx(key, ttlSeconds, JSON.stringify(body));
    }
    return originalSend(body);
  };

  next();
};

/**
 * @param urlToInvalidate   string - url to invalidate the cache
 * @returns                 Promise to invalidate the cache
 * This is not a middleware eventhough it is placed in the middleware folder.
 * This is a helper function for invalidating the cache as the name suggests.
 */
export const invalidateCache = async (urlToInvalidate: string) => {
  await redisClient.del(`cache:${urlToInvalidate}`);
};
