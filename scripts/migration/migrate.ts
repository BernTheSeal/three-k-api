import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { PoolClient } from "pg";

import { withTransaction } from "../../src/shared/lib/db/db.provider";
import { logger } from "../scriptLogger";

interface Migration {
  version: number;
  up: (client: PoolClient) => Promise<void>;
  down?: (client: PoolClient) => Promise<void>;
}

async function migrate() {
  console.log("\n========================================");
  console.log("        MIGRATION STARTING...");
  console.log("========================================\n");

  await withTransaction(async (client) => {
    await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      version INTEGER UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);

    const executed = await client.query<{ version: number }>("SELECT version FROM migrations ORDER BY version");
    const executedVersions = executed.rows.map((r) => r.version);

    const migrationsDir = path.join(__dirname, "/migrations");

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".ts"))
      .sort();

    let prevVersion = 0;

    for (const file of migrationFiles) {
      const versionString = file.split("_")[0];

      if (!versionString || !/^\d{3}$/.test(versionString)) {
        throw new Error(
          `Migration filenames must start with a 3-digit version number and follow the format "001_name.ts": ${file}`,
        );
      }

      const version = parseInt(versionString);

      if (version - prevVersion !== 1) {
        throw new Error(`Migration versions must be sequential: expected ${prevVersion + 1}, but got ${version} in "${file}"`);
      }

      prevVersion += 1;

      if (!executedVersions.includes(version)) {
        logger.running(`${file}`);

        try {
          const migrationPath = path.join(__dirname, "/migrations", file);
          const migrationModule = await import(pathToFileURL(migrationPath).href);
          const migration = migrationModule.default as Migration;
          const migrationName = file.replace(".ts", "");

          if (migration.version !== version) {
            throw new Error(
              `Version mismatch in "${file}": filename declares version ${version}, but migration exports version ${migration.version}`,
            );
          }

          await migration.up(client);

          await client.query("INSERT INTO migrations (version, name) VALUES ($1, $2)", [version, migrationName]);

          logger.done(`${file} completed successfully! \n`);
        } catch (error: any) {
          if (error.constraint === "migrations_version_key") {
            logger.error(`Duplicate version detected in "${file}": version ${version} already exists in migrations table`);
          } else {
            logger.error(error instanceof Error ? error.message : error);
          }

          process.exit(1);
        }
      } else {
        logger.skip(`${file} (already executed) \n`);
      }
    }
  });

  console.log("\n========================================");
  console.log("      MIGRATION COMPLETED!");
  console.log("========================================\n");
  process.exit(0);
}

migrate().catch((error) => {
  logger.error(error.message);
  process.exit(1);
});
