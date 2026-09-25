import { PoolClient } from "pg";

const migration = {
  version: 10,

  up: async (client: PoolClient) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS sentences (
            sentence_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id),
            content VARCHAR(250) NOT NULL,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX idx_sentences_active_user_created ON sentences (user_id, created_at)
        WHERE is_deleted = false;

        CREATE INDEX idx_sentences_active_created ON sentences (created_at)
        WHERE is_deleted = false;
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
        DROP INDEX IF EXISTS idx_sentences_active_created;
        DROP INDEX IF EXISTS idx_sentences_active_user_created;
        DROP TABLE IF EXISTS sentences;
    `);
  },
};

export default migration;
