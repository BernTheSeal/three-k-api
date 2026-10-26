import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import { Options } from "./rateLimit.type";

import { cacheProvider } from "@/shared/lib/cache";
import { RateLimitError } from "@/shared/errors";

const createLimiter = (options: Options) => {
  const { key, window, limit, route, message } = options;

  const windowMs = (window.m ?? 0) * 60 * 1000 + (window.h ?? 0) * 60 * 60 * 1000 + (window.d ?? 0) * 24 * 60 * 60 * 1000;

  return rateLimit({
    windowMs,
    limit,

    store: new RedisStore({
      sendCommand: (...args: string[]) => cacheProvider.sendCommand(args),
      prefix: `rl:${route}:${key}:`,
    }),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req, res) => {
      switch (key) {
        case "auth":
          return res.locals.user.authAccountId?.toString() || "unknown-auth";
        case "email":
          return res.locals.validatedData.body.email || "unknown-email";
        case "ip":
        default:
          return ipKeyGenerator(req.ip ?? "unknown-ip", 56);
      }
    },
    handler: () => {
      throw new RateLimitError({ message: message || "too many request!", code: `TOO_MANY_REQUEST_${key.toUpperCase()}` });
    },
  });
};

export const rateLimitProvider = {
  createLimiter,
};
