import first_3000_word from "../import/first_3000_words.json";
import { PoolClient } from "pg";
import { logger } from "../../scriptLogger";

export const seedWordPosLevels = async (client: PoolClient) => {
  const wordsRes = await client.query(`SELECT word_id, word FROM words`);
  const posRes = await client.query(`SELECT pos_id, pos FROM pos`);
  const levelsRes = await client.query(`SELECT level_id, level FROM levels`);

  const wordMap = Object.fromEntries(
    wordsRes.rows.map((r) => [r.word, r.word_id]),
  );
  const posMap = Object.fromEntries(posRes.rows.map((r) => [r.pos, r.pos_id]));
  const levelMap = Object.fromEntries(
    levelsRes.rows.map((r) => [r.level, r.level_id]),
  );

  const words = first_3000_word;
  let total = 0;

  for (const word of words) {
    const word_id = wordMap[word.word];

    for (const detail of word.details) {
      const pos_id = posMap[detail.pos];
      const level_id = levelMap[detail.level];

      await client.query(
        `INSERT INTO word_pos_levels (word_id, pos_id, level_id) VALUES($1, $2, $3)`,
        [word_id, pos_id, level_id],
      );

      total++;
      logger.running(`${total} word pos levels inserted...`, true);
    }
  }
  process.stdout.write(`\n`);
  logger.done("Word pos levels seeded! \n");
};
