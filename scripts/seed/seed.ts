import { seedWords, seedPos, seedLevels, seedWordPhonetics, seedWordPosLevels } from "./data";

import readline from "readline";

import { withTransaction } from "../../src/shared/lib/db/db.provider";
import { PoolClient } from "pg";

import { logger } from "../scriptLogger";

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
  const tables = ["word_pos_levels", "word_phonetics", "words", "pos", "levels"];

  logger.running("Truncating tables...");

  for (const table of tables) {
    const exists = await client.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      )`,
      [table],
    );

    if (!exists.rows[0].exists) {
      logger.skip(`${table} does not exist`);
      continue;
    }

    await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    logger.done(`${table} cleared`);
  }

  console.log("\n");
};

export const seed = async () => {
  logger.warning("This will delete all existing data and reseed the database.");

  const confirmed = await confirm("Are you sure you want to continue?");

  if (!confirmed) {
    console.log("Seed operation cancelled.");
    process.exit(0);
  }
  console.log("\n========================================");
  console.log("      SEED OPERATION STARTING...");
  console.log("========================================\n");

  try {
    await withTransaction(async (client) => {
      await truncateTables(client);
      await seedWords(client);
      await seedPos(client);
      await seedLevels(client);
      await seedWordPhonetics(client);
      await seedWordPosLevels(client);
    });

    console.log("\n========================================");
    console.log("      SEED OPERATION COMPLETED!");
    console.log("========================================\n");

    process.exit(0);
  } catch (err) {
    logger.error("Seed operation failed!");
    console.error(err);
    process.exit(1);
  }
};

seed();
