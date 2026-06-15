import rateLimit, { MemoryStore, ipKeyGenerator } from "express-rate-limit";
import { RateLimitError } from "../errors";

type Window =
  | { m: number; h?: number; d?: number }
  | { m?: number; h: number; d?: number }
  | { m?: number; h?: number; d: number };

type Limit = {
  key: "auth" | "ip" | "email";
  window: Window;
  limit: number;
};

export const rateLimiter = ({ key, window, limit }: Limit) => {
  const windowMs =
    (window.m ?? 0) * 60 * 1000 +
    (window.h ?? 0) * 60 * 60 * 1000 +
    (window.d ?? 0) * 24 * 60 * 60 * 1000;

  return rateLimit({
    windowMs,
    limit,
    store: new MemoryStore(),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req, res) => {
      switch (key) {
        case "auth":
          return res.locals.auth_account_id?.toString() || "unknown-auth";
        case "email":
          return (
            req.body?.email ||
            res.locals.validated_data.body.email ||
            "unknown-email"
          );
        case "ip":
        default:
          return ipKeyGenerator(req.ip ?? "unknown-ip", 56);
      }
    },
    handler: () => {
      throw new RateLimitError(
        "Too many request!",
        `TOO_MANY_REQUEST_${key.toUpperCase()}`,
      );
    },
  });
};
