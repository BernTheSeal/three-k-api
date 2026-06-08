import { AuthTokenRepo } from "../types/repositories/authToken.repo.type";
import { getExecutor, getLock } from "../lib/db";
import { AuthToken } from "../types/entities";

export const authTokenRepo: AuthTokenRepo = {
  async create(data, tx) {
    const { auth_account_id, token_hash, token_type, expires_at } = data;

    const executor = getExecutor<AuthToken>(tx?.client);

    const response = await executor(
      `
        INSERT INTO auth_tokens (auth_account_id, token_hash , token_type, expires_at)
        VALUES($1, $2, $3, $4)  
        RETURNING *
      `,
      [auth_account_id, token_hash, token_type, expires_at],
    );

    return response.rows[0]!;
  },

  async findByToken(data, tx) {
    const { token_hash } = data;

    const executor = getExecutor<AuthToken>(tx?.client);

    const lock = getLock(tx?.lock);

    const response = await executor(
      ` 
      SELECT * FROM auth_tokens
      WHERE token_hash = $1
      ${lock} `,
      [token_hash],
    );

    return response.rows[0];
  },

  async revoke(data, tx) {
    const { auth_account_id, token_type } = data;

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
      [auth_account_id, token_type],
    );
  },

  async markAsUsed(data, tx) {
    const { auth_token_id } = data;

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
      [auth_token_id],
    );
  },
};
