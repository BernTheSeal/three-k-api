import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RateLimitError } from "../errors";

import { RedisStore } from "rate-limit-redis";
import { redisClient } from "./cache/cache.client";

type Window =
  { m: number; h?: number; d?: number } | { m?: number; h: number; d?: number } | { m?: number; h?: number; d: number };

type Params = {
  key: "auth" | "ip" | "email";
  window: Window;
  limit: number;
  route: string;
  message?: string;
};

export const createRateLimiter = ({ key, window, limit, message, route }: Params) => {
  const windowMs = (window.m ?? 0) * 60 * 1000 + (window.h ?? 0) * 60 * 60 * 1000 + (window.d ?? 0) * 24 * 60 * 60 * 1000;

  return rateLimit({
    windowMs,
    limit,

    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: `rl:${route}:${key}:`,
    }),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req, res) => {
      switch (key) {
        case "auth":
          return res.locals.user.auth_account_id?.toString() || "unknown-auth";
        case "email":
          return res.locals.validated_data.body.email || "unknown-email";
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
