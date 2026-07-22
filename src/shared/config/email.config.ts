import { env } from "./env.config";

export const emailConfig = {
  api: env.email.api,
  to: env.email.to,
  maxAttempt: 3,
  retryDelayMs: 300,
};
