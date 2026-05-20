import { VerificationTokenRepo } from "../types/repositories/verificationToken.repo.type";
import { getExecutor, getLock } from "../lib/db";
import { VerificationToken } from "../types/entities";

export const verificationTokenRepo: VerificationTokenRepo = {
  async create(data, tx) {
    const { auth_account_id, token_hash, token_type, expires_at } = data;

    const executor = getExecutor<VerificationToken>(tx?.client);

    const response = await executor(
      `
        INSERT INTO verification_tokens (auth_account_id, token_hash , token_type, expires_at)
        VALUES($1, $2, $3, $4)  
        RETURNING *
      `,
      [auth_account_id, token_hash, token_type, expires_at],
    );

    return response.rows[0]!;
  },

  async findByUserId(data, tx) {
    const { user_id, is_active, token_type } = data;

    const executor = getExecutor<VerificationToken>(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
    SELECT vt.* FROM verification_tokens vt 
    JOIN auth_accounts aa ON aa.auth_account_id = vt.auth_account_id
    WHERE aa.user_id = $1 
    AND vt.is_active = $2
    AND vt.token_type = $3
    ${lock}
    `,
      [user_id, is_active, token_type],
    );

    return response.rows[0];
  },

  async revoke(data, tx) {
    const { auth_account_id, token_type } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
        UPDATE verification_tokens
          SET is_active = false
          WHERE 
          auth_account_id = $1 AND 
          token_type = $2 AND
          is_active = true
      `,
      [auth_account_id, token_type],
    );
  },

  async markAsUsedById(data, tx) {
    const { verification_token_id } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
        UPDATE verification_tokens 
        SET is_active = false,  used_at = NOW()
        WHERE verification_token_id = $1  
    `,
      [verification_token_id],
    );
  },
};
