import { getExecutor, getLock, toCamelCase } from "@/shared/lib/db/db.provider";
import {
  Create,
  FindByTokenHash,
  FindByTokenHashWithAuthAccount,
  RevokeByTokenHash,
  RevokeByFamilyId,
  RevokeByAuthAccountId,
  RevokeByAuthAccountIdExceptFamilyId,
} from "@/shared/types/repositories/refreshToken.repo.type";
import { AuthAccountEntity, RefreshTokenEntity } from "@/shared/types/entities";

const create: Create = async (params, tx) => {
  const { tokenHash, authAccountId, familyId, expiresAt } = params;

  const executor = getExecutor(tx?.client);

  const response = await executor(
    `INSERT INTO refresh_tokens (token_hash, auth_account_id, family_id, expires_at)
        VALUES($1, $2, $3, $4)
        `,
    [tokenHash, authAccountId, familyId, expiresAt],
  );

  const res = toCamelCase<RefreshTokenEntity>(response.rows);

  return res[0]!;
};

const findByTokenHash: FindByTokenHash = async (params, tx) => {
  const { tokenHash } = params;

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
};

const findByTokenHashWithAuthAccount: FindByTokenHashWithAuthAccount = async (params, tx) => {
  const { tokenHash } = params;

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
};

const revokeByTokenHash: RevokeByTokenHash = async (params, tx) => {
  const { tokenHash, revokedReason } = params;

  const executor = getExecutor(tx?.client);

  await executor(
    `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE token_hash = $2`,
    [revokedReason, tokenHash],
  );
};

const revokeByFamilyId: RevokeByFamilyId = async (params, tx) => {
  const { familyId, revokedReason } = params;

  const executor = getExecutor(tx?.client);

  await executor(
    `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE family_id = $2 AND is_revoked = false`,
    [revokedReason, familyId],
  );
};

const revokeByAuthAccountId: RevokeByAuthAccountId = async (params, tx) => {
  const { authAccountId, revokedReason } = params;

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
};

const revokeByAuthAccountIdExceptFamilyId: RevokeByAuthAccountIdExceptFamilyId = async (params, tx) => {
  const { familyId, revokedReason, authAccountId } = params;

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
};

export const refreshTokenRepo = {
  create,
  findByTokenHash,
  findByTokenHashWithAuthAccount,
  revokeByTokenHash,
  revokeByFamilyId,
  revokeByAuthAccountId,
  revokeByAuthAccountIdExceptFamilyId,
};
