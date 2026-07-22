import { createRateLimiter } from "@/shared/lib/rateLimit.lib";

const loginLimiter = createRateLimiter({
  key: "email",
  window: { h: 1 },
  limit: 100,
});
