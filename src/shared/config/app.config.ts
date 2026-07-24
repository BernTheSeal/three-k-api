import { envConfig } from "./env.config";

export const appConfig = {
  port: parseInt(envConfig.port || "3000", 10),
  nodeEnv: envConfig.nodeEnv,
};
