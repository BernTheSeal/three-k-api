import { env } from "./env.config";

export const poolConfig = {
  user: env.db.user,
  host: env.db.host,
  database: env.db.name,
  password: env.db.password,
  port: parseInt(env.db.port || "5432", 10),
  max: 50,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
} as const;
