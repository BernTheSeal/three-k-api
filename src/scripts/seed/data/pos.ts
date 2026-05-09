import first_3000_word from "../import/first_3000_words.json";
import { PoolClient } from "pg";
import { logger } from "../../scriptLogger";

export const seedPos = async (client: PoolClient) => {
  const pos = [
    ...new Set(first_3000_word.flatMap((w) => w.details.map((d) => d.pos))),
  ];
  const total = pos.length;

  for (let i = 0; i < total; i++) {
    await client.query(`INSERT INTO pos (pos) VALUES ($1)`, [pos[i]]);
    logger.running(`${i + 1}/${total} pos inserted...`, true);
  }
  process.stdout.write(`\n`);
  logger.done("Pos seeded! \n");
};
