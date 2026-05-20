import { AuthAccountRepo } from "../types/repositories/authAccount.repo.type";
import { getExecutor, getLock } from "../lib/db";
import { AuthAccount } from "../types/entities";

export const authAccountRepo: AuthAccountRepo = {
  async create(data, tx) {
    const {
      user_id,
      provider,
      provider_account_id,
      email,
      password_hash,
      is_verified,
    } = data;

    const executor = getExecutor<AuthAccount>(tx?.client);

    const response = await executor(
      `
      INSERT INTO auth_accounts (user_id, provider, provider_account_id, email, password_hash, is_verified)
      VALUES($1, $2, $3, $4, $5 , $6)
      RETURNING *
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

    return response.rows[0]!;
  },

  async findByProviderAccountId(data, tx) {
    const { provider_account_id, provider } = data;

    const executor = getExecutor<AuthAccount>(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM auth_accounts
      WHERE provider = $1 AND provider_account_id = $2
      ${lock}
    `,
      [provider, provider_account_id],
    );

    return response.rows[0];
  },

  async findByUserId(data, tx) {
    const { user_id, provider } = data;

    const executor = getExecutor<AuthAccount>(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
    SELECT * FROM auth_accounts 
    WHERE user_id = $1 AND provider = $2
    ${lock}
      `,
      [user_id, provider],
    );

    return response.rows[0];
  },

  async verifyById(data, tx) {
    const { auth_account_id } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
        UPDATE auth_accounts
        SET is_verified = true
        WHERE auth_account_id = $1  
    `,
      [auth_account_id],
    );
  },
};
