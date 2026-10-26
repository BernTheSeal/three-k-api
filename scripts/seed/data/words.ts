import first_3000_word from "../import/first_3000_words.json";
import { PoolClient } from "pg";
import { logUtil } from "../../../src/shared/utils/log.util";

export const seedWords = async (client: PoolClient) => {
  const words = first_3000_word.map((w) => w.word);
  const total = words.length;

  for (let i = 0; i < total; i++) {
    await client.query(`INSERT INTO words (word) VALUES($1)`, [words[i]]);
    logUtil.info(`${i + 1}/${total} words inserted...`, { tag: "running", singleLine: true });
  }

  logUtil.success("Words seeded!", { tag: "done", gap: true });
};
