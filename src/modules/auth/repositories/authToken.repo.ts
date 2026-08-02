import { AuthTokenRepo } from "@/shared/types/repositories/authToken.repo.type";
import { getExecutor, getLock, toCamelCase } from "@/shared/lib/db.lib";
import { AuthTokenEntity } from "@/shared/types/entities";

export const authTokenRepo: AuthTokenRepo = {
  async create(data, tx) {
    const { authAccountId, tokenHash, tokenType, expiresAt } = data;

    const executor = getExecutor(tx?.client);

    const response = await executor(
      `
        INSERT INTO auth_tokens (auth_account_id, token_hash , token_type, expires_at)
        VALUES($1, $2, $3, $4)  
        RETURNING *
      `,
      [authAccountId, tokenHash, tokenType, expiresAt],
    );

    const res = toCamelCase<AuthTokenEntity>(response.rows);

    return res[0]!;
  },

  async findByToken(data, tx) {
    const { tokenHash } = data;

    const executor = getExecutor(tx?.client);

    const lock = getLock(tx?.lock);

    const response = await executor(
      ` 
      SELECT * FROM auth_tokens
      WHERE token_hash = $1
      ${lock} `,
      [tokenHash],
    );

    const res = toCamelCase<AuthTokenEntity>(response.rows);

    return res[0];
  },

  async revoke(data, tx) {
    const { authAccountId, tokenType } = data;

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
  },

  async markAsUsed(data, tx) {
    const { authTokenId } = data;

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
  },
};
