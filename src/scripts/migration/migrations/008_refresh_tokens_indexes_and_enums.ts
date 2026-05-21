import { PoolClient } from "pg";

const migration = {
  version: 8,

  up: async (client: PoolClient) => {
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id 
      ON refresh_tokens(family_id);

      ALTER TYPE revoked_reason_enum ADD VALUE IF NOT EXISTS 'password_change';
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
      DROP INDEX IF EXISTS idx_refresh_tokens_family_id;
    `);
  },
};

export default migration;
