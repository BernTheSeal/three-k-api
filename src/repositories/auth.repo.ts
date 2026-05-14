import { getExecutor, query } from "../lib/db";
import { AuthAccount, RefreshToken } from "../types/entities";
import { AuthRepo } from "../types/repositories/auth.repo.types";

export const authRepo: AuthRepo = {
  async createRt(data, client) {
    const { token_hash, user_id, family_id, expires_at } = data;

    const executor = getExecutor(client);

    await executor(
      `INSERT INTO refresh_tokens (token_hash, user_id, family_id, expires_at)
        VALUES($1, $2, $3, $4)
        `,
      [token_hash, user_id, family_id, expires_at],
    );
  },

  async getRt(data) {
    const { token_hash } = data;
    const response = await query<RefreshToken>(
      `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1
    `,
      [token_hash],
    );

    return response.rows[0];
  },

  async getRtForUpdate(data, client) {
    const { token_hash } = data;
    const response = await client.query<RefreshToken>(
      `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1  
      FOR UPDATE;
    `,
      [token_hash],
    );

    return response.rows[0];
  },

  async revokeRt(by, reason, client) {
    const executor = getExecutor(client);

    if ("token_hash" in by) {
      await executor(
        `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE token_hash = $2`,
        [reason, by.token_hash],
      );
    } else {
      await executor(
        `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE family_id = $2 AND is_revoked = false`,
        [reason, by.family_id],
      );
    }
  },

  async createAuthAccount(data, client) {
    const {
      user_id,
      provider,
      provider_account_id,
      email,
      password_hash,
      is_verified,
    } = data;

    await client.query(
      `
      INSERT INTO auth_accounts (user_id, provider, provider_account_id, email, password_hash, is_verified)
      VALUES($1, $2, $3, $4, $5 , $6)
      `,
      [
        user_id,
        provider,
        provider_account_id,
        email,
        password_hash,
        is_verified,
      ],
    );
  },

  async getAuthAccountWithPassword(data) {
    const { provider, provider_account_id } = data;

    const response = await query<AuthAccount>(
      `
      SELECT * FROM auth_accounts
      WHERE provider = $1 AND provider_account_id = $2
    `,
      [provider, provider_account_id],
    );

    return response.rows[0];
  },

  async getAuthAccount(data) {
    const { provider, provider_account_id } = data;

    const response = await query<Omit<AuthAccount, "password_hash">>(
      `
      SELECT * FROM auth_accounts
      WHERE provider = $1 AND provider_account_id = $2
    `,
      [provider, provider_account_id],
    );

    return response.rows[0];
  },
};
