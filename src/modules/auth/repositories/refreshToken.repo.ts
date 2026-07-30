import { RefreshTokenRepo } from "@/shared/types/repositories/refreshToken.repo.type";
import { getExecutor, getLock } from "@/shared/lib/db.lib";
import { AuthAccount, RefreshToken } from "@/shared/types/entities";

export const refreshTokenRepo: RefreshTokenRepo = {
  async create(data, tx) {
    const { token_hash, auth_account_id, family_id, expires_at } = data;

    const executor = getExecutor(tx?.client);

    const response = await executor(
      `INSERT INTO refresh_tokens (token_hash, auth_account_id, family_id, expires_at)
        VALUES($1, $2, $3, $4)
        `,
      [token_hash, auth_account_id, family_id, expires_at],
    );

    return response.rows[0] as RefreshToken;
  },

  async findByTokenHash(data, tx) {
    const { token_hash } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1
      ${lock}
    `,
      [token_hash],
    );

    return response.rows[0] as RefreshToken | undefined;
  },

  async findByTokenHashWithAuthAccount(data, tx) {
    const { token_hash } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM refresh_tokens rt
      JOIN auth_accounts aa ON rt.auth_account_id = aa.auth_account_id
      WHERE token_hash = $1
      ${lock}
    `,
      [token_hash],
    );

    return response.rows[0] as (RefreshToken & AuthAccount) | undefined;
  },

  async revokeByTokenHash(data, tx) {
    const { token_hash, revoked_reason } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE token_hash = $2`,
      [revoked_reason, token_hash],
    );
  },

  async revokeByFamilyId(data, tx) {
    const { family_id, revoked_reason } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE family_id = $2 AND is_revoked = false`,
      [revoked_reason, family_id],
    );
  },

  async revokeByAuthAccountId(data, tx) {
    const { auth_account_id, revoked_reason } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
      UPDATE refresh_tokens
      SET 
        is_revoked = true, 
        revoked_reason = $1, 
        revoked_at = NOW()
      WHERE auth_account_id = $2 AND is_revoked = false
      `,
      [revoked_reason, auth_account_id],
    );
  },

  async revokeByAuthAccountIdExceptFamilyId(data, tx) {
    const { family_id, revoked_reason, auth_account_id } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `UPDATE refresh_tokens
     SET is_revoked = true, revoked_reason = $2, revoked_at = NOW()
     WHERE auth_account_id = $1 AND 
     is_revoked = false AND
     family_id != $3
     `,
      [auth_account_id, revoked_reason, family_id],
    );
  },
};
