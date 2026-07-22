import { PoolClient } from "pg";

const migration = {
  version: 6,

  up: async (client: PoolClient) => {
    await client.query(`
     ALTER TABLE users
        DROP COLUMN IF EXISTS email,
        DROP COLUMN IF EXISTS password_hash,
        DROP COLUMN IF EXISTS google_id,
        DROP COLUMN IF EXISTS photo_url,
        DROP COLUMN IF EXISTS is_email_verified;

    ALTER TABLE users
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
      
    DO $$ BEGIN     
      CREATE TYPE provider_enum AS ENUM ('local', 'google');
    EXCEPTION   
        WHEN duplicate_object THEN NULL; 
    END $$;

    CREATE TABLE IF NOT EXISTS auth_accounts (
        auth_account_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        provider provider_enum NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255),
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

        CONSTRAINT uq_auth_provider_account UNIQUE (provider_account_id, provider),
        CONSTRAINT uq_auth_user_provider UNIQUE (user_id, provider),
        CONSTRAINT uq_auth_email_provider UNIQUE(email, provider)
    );

    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
      DROP TABLE IF EXISTS auth_accounts;
      DROP TYPE IF EXISTS provider_enum;

      ALTER TABLE users
        DROP COLUMN IF EXISTS is_active;

      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
        ADD COLUMN IF NOT EXISTS google_id VARCHAR(255),
        ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255),
        ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;

    `);
  },
};

export default migration;
