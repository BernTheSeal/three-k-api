import { AuthAccountRepo } from "@/shared/types/repositories/authAccount.repo.type";
import { AuthAccount } from "@/shared/types/entities";
import { getExecutor, getLock } from "@/shared/lib/db.lib";

export const authAccountRepo: AuthAccountRepo = {
  async create(data, tx) {
    const { user_id, provider, provider_account_id, email, password_hash, is_verified } = data;

    const executor = getExecutor(tx?.client);

    const response = await executor(
      `
      INSERT INTO auth_accounts (user_id, provider, provider_account_id, email, password_hash, is_verified)
      VALUES($1, $2, $3, $4, $5 , $6)
      RETURNING *
      `,
      [user_id, provider, provider_account_id, email, password_hash, is_verified],
    );

    return response.rows[0] as AuthAccount;
  },

  async findById(data, tx) {
    const { auth_account_id, provider } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM auth_accounts
      WHERE auth_account_id = $1 AND provider = $2
      ${lock}
    `,
      [auth_account_id, provider],
    );

    return response.rows[0] as AuthAccount | undefined;
  },

  async findByProviderAccountId(data, tx) {
    const { provider_account_id, provider } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM auth_accounts
      WHERE provider = $1 AND provider_account_id = $2
      ${lock}
    `,
      [provider, provider_account_id],
    );

    return response.rows[0] as AuthAccount | undefined;
  },

  async findByEmail(data, tx) {
    const { email, provider } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
    SELECT * FROM auth_accounts 
    WHERE email = $1 AND provider = $2
    ${lock}
      `,
      [email, provider],
    );

    return response.rows[0] as AuthAccount | undefined;
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

  async updatePassword(data, tx) {
    const { auth_account_id, password_hash } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
      UPDATE auth_accounts  
      SET password_hash = $1, updated_at = NOW()
      WHERE auth_account_id = $2 AND provider = 'local'
    `,
      [password_hash, auth_account_id],
    );
  },
};
