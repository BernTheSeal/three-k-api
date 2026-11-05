import { Pool } from "pg";

import { poolConfig } from "@/shared/config/db.config";
import { logUtil } from "@/shared/utils/log.util";

export const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  pool.on("error", (err) => logUtil.error("Postgres pool error.", { tag: "postgres", payload: err }));
});
