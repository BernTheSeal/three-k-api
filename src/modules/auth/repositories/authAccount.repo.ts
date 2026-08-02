import { AuthAccountRepo } from "@/shared/types/repositories/authAccount.repo.type";
import { AuthAccountEntity } from "@/shared/types/entities";
import { getExecutor, getLock, toCamelCase } from "@/shared/lib/db.lib";

export const authAccountRepo: AuthAccountRepo = {
  async create(data, tx) {
    const { userId, provider, providerAccountId, email, passwordHash, isVerified } = data;

    const executor = getExecutor(tx?.client);

    const response = await executor(
      `
      INSERT INTO auth_accounts (user_id, provider, provider_account_id, email, password_hash, is_verified)
      VALUES($1, $2, $3, $4, $5 , $6)
      RETURNING *
      `,
      [userId, provider, providerAccountId, email, passwordHash, isVerified],
    );

    const res = toCamelCase<AuthAccountEntity>(response.rows);

    return res[0]!;
  },

  async findById(data, tx) {
    const { authAccountId, provider } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM auth_accounts
      WHERE auth_account_id = $1 AND provider = $2
      ${lock}
    `,
      [authAccountId, provider],
    );

    const res = toCamelCase<AuthAccountEntity>(response.rows);
    return res[0];
  },

  async findByProviderAccountId(data, tx) {
    const { providerAccountId, provider } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM auth_accounts
      WHERE provider = $1 AND provider_account_id = $2
      ${lock}
    `,
      [provider, providerAccountId],
    );

    const res = toCamelCase<AuthAccountEntity>(response.rows);

    return res[0];
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

    const res = toCamelCase<AuthAccountEntity>(response.rows);

    return res[0];
  },

  async verifyById(data, tx) {
    const { authAccountId } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
        UPDATE auth_accounts
        SET is_verified = true
        WHERE auth_account_id = $1  
    `,
      [authAccountId],
    );
  },

  async updatePassword(data, tx) {
    const { authAccountId, passwordHash } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
      UPDATE auth_accounts  
      SET password_hash = $1, updated_at = NOW()
      WHERE auth_account_id = $2 AND provider = 'local'
    `,
      [passwordHash, authAccountId],
    );
  },
};
