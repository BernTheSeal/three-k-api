import { PoolClient } from "pg";

const migration = {
  version: 5,

  up: async (client: PoolClient) => {
    await client.query(`
        DO $$ BEGIN
            CREATE TYPE revoked_reason_enum AS ENUM ('refresh' , 'suspect' , 'logout' , 'expired');
        EXCEPTION   
            WHEN duplicate_object THEN NULL; 
        END $$;

        CREATE TABLE IF NOT EXISTS refresh_tokens (
            token_hash VARCHAR(255) PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            family_id VARCHAR,
            is_revoked BOOLEAN DEFAULT FALSE,
            revoked_reason revoked_reason_enum,
            revoked_at TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_per_family
        ON refresh_tokens (family_id)
        WHERE is_revoked = FALSE;

    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
        DROP TABLE IF EXISTS refresh_tokens CASCADE;
        DROP TYPE IF EXISTS revoked_reason_enum;
    `);
  },
};

export default migration;
