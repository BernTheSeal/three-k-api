import { createClient } from "redis";
import { cacheConfig } from "@/shared/config/cache.config";

export const redisClient = createClient({
  url: cacheConfig.url,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected successfully.");
};

connectRedis();
