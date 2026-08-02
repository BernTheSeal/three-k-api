import { RefreshTokenRepo } from "@/shared/types/repositories/refreshToken.repo.type";
import { getExecutor, getLock, toCamelCase } from "@/shared/lib/db.lib";
import { AuthAccountEntity, RefreshTokenEntity } from "@/shared/types/entities";

export const refreshTokenRepo: RefreshTokenRepo = {
  async create(data, tx) {
    const { tokenHash, authAccountId, familyId, expiresAt } = data;

    const executor = getExecutor(tx?.client);

    const response = await executor(
      `INSERT INTO refresh_tokens (token_hash, auth_account_id, family_id, expires_at)
        VALUES($1, $2, $3, $4)
        `,
      [tokenHash, authAccountId, familyId, expiresAt],
    );

    const res = toCamelCase<RefreshTokenEntity>(response.rows);

    return res[0]!;
  },

  async findByTokenHash(data, tx) {
    const { tokenHash } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1
      ${lock}
    `,
      [tokenHash],
    );

    const res = toCamelCase<RefreshTokenEntity>(response.rows);

    return res[0];
  },

  async findByTokenHashWithAuthAccount(data, tx) {
    const { tokenHash } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM refresh_tokens rt
      JOIN auth_accounts aa ON rt.auth_account_id = aa.auth_account_id
      WHERE token_hash = $1
      ${lock}
    `,
      [tokenHash],
    );

    const res = toCamelCase<RefreshTokenEntity & AuthAccountEntity>(response.rows);

    return res[0];
  },

  async revokeByTokenHash(data, tx) {
    const { tokenHash, revokedReason } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE token_hash = $2`,
      [revokedReason, tokenHash],
    );
  },

  async revokeByFamilyId(data, tx) {
    const { familyId, revokedReason } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE family_id = $2 AND is_revoked = false`,
      [revokedReason, familyId],
    );
  },

  async revokeByAuthAccountId(data, tx) {
    const { authAccountId, revokedReason } = data;

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
      [revokedReason, authAccountId],
    );
  },

  async revokeByAuthAccountIdExceptFamilyId(data, tx) {
    const { familyId, revokedReason, authAccountId } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `UPDATE refresh_tokens
     SET is_revoked = true, revoked_reason = $2, revoked_at = NOW()
     WHERE auth_account_id = $1 AND 
     is_revoked = false AND
     family_id != $3
     `,
      [authAccountId, revokedReason, familyId],
    );
  },
};
