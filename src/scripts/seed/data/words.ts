import first_3000_word from "../import/first_3000_words.json";
import { PoolClient } from "pg";

export const seedWords = async (client: PoolClient) => {
  console.log("📝 Seeding words...");

  const words = first_3000_word.map((w) => w.word);
  const total = words.length;

  for (let i = 0; i < total; i++) {
    await client.query(`INSERT INTO words (word) VALUES($1)`, [words[i]]);

    process.stdout.write(`\r ${i + 1}/${total} words inserted...`);
  }

  console.log("✅ Words seeded!");
};
