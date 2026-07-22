import { PoolClient } from "pg";

const migration = {
  version: 1,

  up: async (client: PoolClient) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
        user_id        SERIAL PRIMARY KEY,
        email          VARCHAR(255),
        username       VARCHAR(50),
        password_hash  VARCHAR(255),
        google_id      VARCHAR(255),
        photo_url      VARCHAR(255),
        is_email_verified BOOLEAN DEFAULT FALSE,
        created_at     TIMESTAMP DEFAULT NOW(),
        updated_at     TIMESTAMP DEFAULT NOW(),

        CONSTRAINT uq_users_email     UNIQUE (email),
        CONSTRAINT uq_users_username  UNIQUE (username),
        CONSTRAINT uq_users_google_id UNIQUE (google_id)
      );
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`DROP TABLE IF EXISTS users CASCADE`);
  },
};

export default migration;
