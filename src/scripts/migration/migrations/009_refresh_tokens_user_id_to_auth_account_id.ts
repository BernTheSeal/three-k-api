import { PoolClient } from "pg";

const migration = {
  version: 9,

  up: async (client: PoolClient) => {
    await client.query(`
      ALTER TABLE refresh_tokens
      DROP CONSTRAINT refresh_tokens_user_id_fkey,
      DROP COLUMN user_id,
      ADD COLUMN auth_account_id INTEGER NOT NULL REFERENCES auth_accounts(auth_account_id) ON DELETE CASCADE;
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
      ALTER TABLE refresh_tokens
      DROP CONSTRAINT refresh_tokens_auth_account_id_fkey,
      DROP COLUMN auth_account_id,
      ADD COLUMN user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE;
    `);
  },
};

export default migration;
