import first_3000_word from "../import/first_3000_words.json";
import { PoolClient } from "pg";
import { logUtil } from "../../../src/shared/utils/log.util";

export const seedPos = async (client: PoolClient) => {
  const pos = [...new Set(first_3000_word.flatMap((w) => w.details.map((d) => d.pos)))];

  const posWithExtra = [...pos, "punctuation"];
  const total = posWithExtra.length;

  for (let i = 0; i < total; i++) {
    await client.query(`INSERT INTO pos (pos) VALUES ($1)`, [posWithExtra[i]]);
    logUtil.info(`${i + 1}/${total} pos inserted...`, { tag: "running", singleLine: true });
  }
  logUtil.success("Pos seeded!", { tag: "done", gap: true });
};
