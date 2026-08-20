import { getExecutor, getLock } from "@/shared/lib/db/db.provider";
import { Create, FindByToken, Revoke, MarkAsUsed } from "./authToken.repo.type";
import { AuthTokenEntity } from "@/shared/types/entities";

const create: Create = async (params, tx) => {
  const { authAccountId, tokenHash, tokenType, expiresAt } = params;

  const executor = getExecutor<AuthTokenEntity>(tx?.client);

  const response = await executor(
    `
        INSERT INTO auth_tokens (auth_account_id, token_hash , token_type, expires_at)
        VALUES($1, $2, $3, $4)  
        RETURNING *
      `,
    [authAccountId, tokenHash, tokenType, expiresAt],
  );

  return response.rows[0]!;
};

const findByToken: FindByToken = async (params, tx) => {
  const { tokenHash } = params;

  const executor = getExecutor<AuthTokenEntity>(tx?.client);

  const lock = getLock(tx?.lock);

  const response = await executor(
    ` 
      SELECT * FROM auth_tokens
      WHERE token_hash = $1
      ${lock} `,
    [tokenHash],
  );

  return response.rows[0];
};

const revoke: Revoke = async (params, tx) => {
  const { authAccountId, tokenType } = params;

  const executor = getExecutor(tx?.client);

  await executor(
    `
        UPDATE auth_tokens
          SET revoked_at = NOW()
          WHERE 
          auth_account_id = $1 AND 
          token_type = $2 AND
          used_at IS NULL AND 
          revoked_at IS NULL
      `,
    [authAccountId, tokenType],
  );
};

const markAsUsed: MarkAsUsed = async (params, tx) => {
  const { authTokenId } = params;

  const executor = getExecutor(tx?.client);

  await executor(
    `
        UPDATE auth_tokens 
        SET used_at = NOW()
        WHERE 
        auth_token_id = $1 AND 
        used_at IS NULL AND 
        revoked_at IS NULL

    `,
    [authTokenId],
  );
};

export const authTokenRepo = {
  create,
  findByToken,
  revoke,
  markAsUsed,
};
