import { PoolClient } from "pg";
import readline from "readline";

import { seedWords, seedPos, seedLevels, seedWordPhonetics, seedWordPosLevels } from "./data";
import { dbProvider } from "../../src/shared/lib/db/";
import { logUtil } from "../../src/shared/utils/log.util";

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

  logUtil.info("Truncating tables...", { tag: "running" });

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i]!;

    const exists = await client.query(
      `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = $1
    )`,
      [table],
    );

    if (!exists.rows[0].exists) {
      logUtil.warning(`${table} does not exist`, { tag: "skip" });
      continue;
    }

    await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    logUtil.success(`${table} cleared`, { tag: "done", gap: i == tables.length - 1 });
  }
};

export const seed = async () => {
  logUtil.warning("This will delete all existing data and reseed the database.");

  const confirmed = await confirm("Are you sure you want to continue?");

  if (!confirmed) {
    logUtil.info("Seed operation cancelled.");
    process.exit(0);
  }

  logUtil.title("SEED OPERATION STARTING...");

  try {
    await dbProvider.withTransaction(async (client) => {
      await truncateTables(client);
      await seedWords(client);
      await seedPos(client);
      await seedLevels(client);
      await seedWordPhonetics(client);
      await seedWordPosLevels(client);
    });

    logUtil.title("SEED OPERATION COMPLETED!", "green");
    process.exit(0);
  } catch (err) {
    logUtil.error(`Seed operation failed! , ${err}`);
    process.exit(1);
  }
};

seed();
