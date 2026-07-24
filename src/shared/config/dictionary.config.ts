import { envConfig } from "./env.config";

export const dictionaryConfig = {
  url: envConfig.dictionary.apiUrl,
  timeoutMs: 3000,
  maxAttempt: 3,
  retryDelayMs: 300,
  cache: {
    namespace: "dictionary",
    version: 1,
    ttlSec: 60 * 60 * 24 * 7,
  },
};
