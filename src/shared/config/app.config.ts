import { env } from "./env.config";

export const appConfig = {
  port: parseInt(env.port || "3000", 10),
  nodeEnv: env.nodeEnv,
};
