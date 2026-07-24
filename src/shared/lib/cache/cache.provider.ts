import { redisClient } from "./cache.client";
import { ExternalServiceError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

const get = async (key: string): Promise<unknown> => {
  try {
    const value = await redisClient.get(key);

    return value === null ? null : JSON.parse(value);
  } catch (error) {
    throw new ExternalServiceError("Cache get failed!", HTTP_STATUS.BAD_GATEWAY, "cache", error);
  }
};

const set = async (key: string, value: unknown, ttlSeconds?: number): Promise<void> => {
  try {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.set(key, serialized, { EX: ttlSeconds });
    } else {
      await redisClient.set(key, serialized);
    }
  } catch (error) {
    throw new ExternalServiceError("Cache set failed!", HTTP_STATUS.BAD_GATEWAY, "cache", error);
  }
};

const del = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    throw new ExternalServiceError("Cache delete failed!", HTTP_STATUS.BAD_GATEWAY, "cache", error);
  }
};

export const cacheProvider = {
  set,
  get,
  del,
};
