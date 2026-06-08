import { PoolClient } from "pg";

const migration = {
  version: 7,

  up: async (client: PoolClient) => {
    await client.query(`
        DO $$ BEGIN     
            CREATE TYPE token_type_enum AS ENUM ('verification_email', 'password_reset');
        EXCEPTION   
            WHEN duplicate_object THEN NULL; 
        END $$;

        CREATE TABLE IF NOT EXISTS auth_tokens (
            auth_token_id SERIAL PRIMARY KEY,
            auth_account_id INTEGER REFERENCES auth_accounts(auth_account_id) ON DELETE CASCADE,
            token_hash TEXT NOT NULL UNIQUE,
            token_type token_type_enum NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used_at TIMESTAMP DEFAULT NULL,
            revoked_at TIMESTAMP DEFAULT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE UNIQUE INDEX idx_one_active_token 
            ON auth_tokens(auth_account_id, token_type) 
            WHERE used_at IS NULL AND revoked_at IS NULL;
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
        DROP TABLE IF EXISTS auth_tokens;
        DROP TYPE IF Exists token_type_enum
    `);
  },
};

export default migration;
