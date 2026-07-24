import { envConfig } from "./env.config";

export const emailConfig = {
  api: envConfig.email.api,
  to: envConfig.email.to,
  maxAttempt: 3,
  retryDelayMs: 300,
};
