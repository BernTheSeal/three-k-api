import { PoolClient } from "pg";
import { logUtil } from "../../../src/shared/utils/log.util";

export const seedLevels = async (client: PoolClient) => {
  const levels = ["a1", "a2", "b1", "b2", "c1", "c2"];

  const total = levels.length;

  for (let i = 0; i < total; i++) {
    await client.query(`INSERT INTO levels (level) VALUES ($1)`, [levels[i]]);
    logUtil.info(` ${i + 1}/${total} level inserted...`, { tag: "running", singleLine: true });
  }

  logUtil.success("Levels seeded!", { tag: "done", gap: true });
};
