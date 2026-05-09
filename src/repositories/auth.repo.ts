import { getExecutor, query } from "../lib/db";
import { PoolClient } from "pg";
import { RefreshToken } from "../types/entities/refreshToken";
import { User } from "../types/entities/user";

type AuthRepo = {
  createRt: (
    data: Pick<
      RefreshToken,
      "token_hash" | "user_id" | "family_id" | "expires_at"
    >,
    client?: PoolClient,
  ) => Promise<void>;

  getRt: (
    data: Pick<RefreshToken, "token_hash">,
  ) => Promise<RefreshToken | undefined>;

  getRtForUpdate: (
    data: Pick<RefreshToken, "token_hash">,
    client: PoolClient,
  ) => Promise<RefreshToken | undefined>;

  revokeRt: (
    by: Pick<RefreshToken, "token_hash"> | Pick<RefreshToken, "family_id">,
    reason: Exclude<RefreshToken["revoked_reason"], null>,
    client?: PoolClient,
  ) => Promise<void>;
};

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
};
