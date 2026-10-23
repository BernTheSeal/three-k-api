import { PoolClient } from "pg";

const migration = {
  version: 10,

  up: async (client: PoolClient) => {
    await client.query(`
        CREATE TABLE sentences (
            sentence_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX idx_sentences_user_id_created_at ON sentences (user_id, created_at)
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
        DROP TABLE IF EXISTS sentences;
    `);
  },
};

export default migration;
