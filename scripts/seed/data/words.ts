import first_3000_word from "../import/first_3000_words.json";
import { PoolClient } from "pg";
import { logger } from "../../scriptLogger";

export const seedWords = async (client: PoolClient) => {
  const words = first_3000_word.map((w) => w.word);
  const total = words.length;

  for (let i = 0; i < total; i++) {
    await client.query(`INSERT INTO words (word) VALUES($1)`, [words[i]]);
    logger.running(`${i + 1}/${total} words inserted...`, true);
  }
  process.stdout.write("\n");
  logger.done("Words seeded! \n");
};
