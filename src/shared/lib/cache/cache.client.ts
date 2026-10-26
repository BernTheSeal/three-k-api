import { createClient } from "redis";
import { cacheConfig } from "@/shared/config/cache.config";
import { logUtil } from "@/shared/utils/log.util";

export const redisClient = createClient({
  url: cacheConfig.url,
});

redisClient.on("error", (err) => logUtil.error("Redis client error.", { tag: "redis", payload: err }));

const connectRedis = async () => {
  await redisClient.connect();
  logUtil.info("Redis connected successfully.");
};

connectRedis();
