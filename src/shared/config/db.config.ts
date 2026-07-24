import { envConfig } from "./env.config";

export const poolConfig = {
  user: envConfig.db.user,
  host: envConfig.db.host,
  database: envConfig.db.name,
  password: envConfig.db.password,
  port: parseInt(envConfig.db.port || "5432", 10),
  max: 50,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
} as const;
