import { poolConfig } from "../../config/db.config";
import { Pool } from "pg";

export const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Postgres Pool Error", err);
});
