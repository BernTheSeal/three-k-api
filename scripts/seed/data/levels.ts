import { PoolClient } from "pg";
import { logger } from "../../scriptLogger";

export const seedLevels = async (client: PoolClient) => {
  const levels = ["a1", "a2", "b1", "b2", "c1", "c2"];

  const total = levels.length;

  for (let i = 0; i < total; i++) {
    await client.query(`INSERT INTO levels (level) VALUES ($1)`, [levels[i]]);
    logger.running(` ${i + 1}/${total} level inserted...`, true);
  }
  process.stdout.write("\n");
  logger.done("Levels seeded! \n");
};
