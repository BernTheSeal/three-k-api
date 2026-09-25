import { redisClient } from "./cache.client";
import { ExternalServiceError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

const get = async (key: string): Promise<unknown> => {
  try {
    const value = await redisClient.get(key);

    return value === null ? null : JSON.parse(value);
  } catch (error) {
    throw new ExternalServiceError({
      message: "Cache get failed!",
      code: "CACHE_GET_FAILED",
      statusCode: HTTP_STATUS.BAD_GATEWAY,
      service: "CACHE",
      cause: error,
    });
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
    throw new ExternalServiceError({
      message: "Cache set failed!",
      code: "CACHE_SET_FAILED",
      service: "CACHE",
      cause: error,
    });
  }
};

const del = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    throw new ExternalServiceError({
      message: "Cache delete failed!",
      code: "CACHE_DELETE_FAILED",
      service: "CACHE",
      cause: error,
    });
  }
};

const setHash = async <T extends number | string | Buffer>(key: string, fields: Record<string, T>): Promise<void> => {
  try {
    await redisClient.hSet(key, fields);
  } catch (error) {
    throw new ExternalServiceError({
      message: "Cache set hash failed!",
      code: "CACHE_SET_HASH_FAILED",
      service: "CACHE",
      cause: error,
    });
  }
};

const getHashMany = async (key: string, fields: string[]): Promise<(string | null)[]> => {
  try {
    return await redisClient.hmGet(key, fields);
  } catch (error) {
    throw new ExternalServiceError({
      message: "Cache get hash many failed!",
      code: "CACHE_GET_HASH_MANY_FAILED",
      service: "CACHE",
      cause: error,
    });
  }
};

const hashLen = async (key: string): Promise<number> => {
  try {
    return await redisClient.hLen(key);
  } catch (error) {
    throw new ExternalServiceError({
      message: "Cache hash len failed!",
      code: "CACHE_HASH_LEN_FAILED",
      service: "CACHE",
      cause: error,
    });
  }
};

export const cacheProvider = {
  set,
  get,
  del,
  setHash,
  getHashMany,
  hashLen,
};
