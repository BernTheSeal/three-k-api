import { env } from "./env.config";

export const dictionaryConfig = {
  url: env.dictionary.apiUrl,
  timeoutMs: 3000,
  maxAttempt: 3,
  retryDelayMs: 300,
};
