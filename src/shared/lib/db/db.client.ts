import { poolConfig } from "../../config/db.config";
import { Pool } from "pg";
import { logUtil } from "@/shared/utils/log.util";

export const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  pool.on("error", (err) => logUtil.error("Postgres pool error.", { tag: "postgres", payload: err }));
});
