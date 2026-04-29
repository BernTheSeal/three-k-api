import {
  seedWords,
  seedPos,
  seedLevels,
  seedWordPhonetics,
  seedWordPosLevels,
} from "./data";

import readline from "readline";

import { withTransaction } from "../../lib/db";
import { PoolClient } from "pg";

const confirm = async (message: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
};

const truncateTables = async (client: PoolClient) => {
  const tables = [
    "word_pos_levels",
    "word_phonetics",
    "words",
    "pos",
    "levels",
  ];

  console.log("🗑️ Truncating tables...");

  for (const table of tables) {
    const exists = await client.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      )`,
      [table],
    );

    if (!exists.rows[0].exists) {
      console.log(`⚠️ ${table} does not exist, skipping...`);
      continue;
    }

    await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    console.log(`   ✓ ${table} cleared`);
  }

  console.log("✅ All tables cleared successfully.");
};

export const seed = async () => {
  console.log(
    "⚠️ WARNING: This will delete all existing data and reseed the database.",
  );

  const confirmed = await confirm("Are you sure you want to continue?");

  if (!confirmed) {
    console.log("Seed operation cancelled.");
    process.exit(0);
  }

  console.log("Starting seed operation...");

  try {
    await withTransaction(async (client) => {
      await truncateTables(client);
      await seedWords(client);
      await seedPos(client);
      await seedLevels(client);
      await seedWordPhonetics(client);
      await seedWordPosLevels(client);
    });

    console.log("✅ Seed operation completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed operation failed:", err);
    process.exit(1);
  }
};

seed();
