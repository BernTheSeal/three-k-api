import { getExecutor, getLock } from "@/shared/lib/db/db.provider";
import { AuthAccountEntity } from "@/shared/types/entities";

import { Create, FindById, FindByProviderAccountId, FindByEmail, VerifyById, UpdatePassword } from "./authAccount.repo.type";

const create: Create = async (params, tx) => {
  const { userId, provider, providerAccountId, email, passwordHash, isVerified } = params;

  const executor = getExecutor<AuthAccountEntity>(tx?.client);

  const response = await executor(
    `
      INSERT INTO auth_accounts (user_id, provider, provider_account_id, email, password_hash, is_verified)
      VALUES($1, $2, $3, $4, $5 , $6)
      RETURNING *
      `,
    [userId, provider, providerAccountId, email, passwordHash, isVerified],
  );

  return response.rows[0]!;
};

const findById: FindById = async (params, tx) => {
  const { authAccountId, provider } = params;

  const executor = getExecutor<AuthAccountEntity>(tx?.client);

  const lock = getLock(tx?.lock);

  const response = await executor(
    `
      SELECT * FROM auth_accounts
      WHERE auth_account_id = $1 AND provider = $2
      ${lock}
    `,
    [authAccountId, provider],
  );

  return response.rows[0];
};

const findByProviderAccountId: FindByProviderAccountId = async (params, tx) => {
  const { providerAccountId, provider } = params;

  const executor = getExecutor<AuthAccountEntity>(tx?.client);

  const lock = getLock(tx?.lock);

  const response = await executor(
    `
      SELECT * FROM auth_accounts
      WHERE provider = $1 AND provider_account_id = $2
      ${lock}
    `,
    [provider, providerAccountId],
  );

  return response.rows[0];
};

const findByEmail: FindByEmail = async (params, tx) => {
  const { email, provider } = params;

  const executor = getExecutor<AuthAccountEntity>(tx?.client);

  const lock = getLock(tx?.lock);

  const response = await executor(
    `
    SELECT * FROM auth_accounts 
    WHERE email = $1 AND provider = $2
    ${lock}
      `,
    [email, provider],
  );

  return response.rows[0];
};

const verifyById: VerifyById = async (params, tx) => {
  const { authAccountId } = params;

  const executor = getExecutor(tx?.client);

  await executor(
    `
        UPDATE auth_accounts
        SET is_verified = true
        WHERE auth_account_id = $1  
    `,
    [authAccountId],
  );
};

const updatePassword: UpdatePassword = async (params, tx) => {
  const { authAccountId, passwordHash } = params;

  const executor = getExecutor(tx?.client);

  await executor(
    `
      UPDATE auth_accounts  
      SET password_hash = $1, updated_at = NOW()
      WHERE auth_account_id = $2 AND provider = 'local'
    `,
    [passwordHash, authAccountId],
  );
};

export const authAccountRepo = {
  create,
  findById,
  findByProviderAccountId,
  findByEmail,
  verifyById,
  updatePassword,
};
