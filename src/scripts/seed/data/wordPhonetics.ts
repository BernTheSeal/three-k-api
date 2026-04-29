import first_3000_word from "../import/first_3000_words.json";
import { PoolClient } from "pg";

export const seedWordPhonetics = async (client: PoolClient) => {
  console.log("📝 Seeding words phonetics...");

  const words = first_3000_word;
  let total = 0;

  for (let i = 0; i < words.length; i++) {
    const elem = words[i];
    if (!elem) throw new Error(`Word at index ${i} is undefined`);

    const word = elem.word;

    const result = await client.query(
      `SELECT word_id FROM words WHERE word = $1`,
      [word],
    );

    const word_id = result.rows[0].word_id;

    for (const [locale, val] of Object.entries(elem.phonetics)) {
      await client.query(
        `INSERT INTO word_phonetics (word_id, locale, text, mp3) VALUES($1, $2, $3, $4)`,
        [word_id, locale, val.text, val.mp3],
      );
      total++;
      process.stdout.write(`\r ${total} phonetics inserted...`);
    }
  }

  console.log("✅ Words phonetics seeded!");
};
