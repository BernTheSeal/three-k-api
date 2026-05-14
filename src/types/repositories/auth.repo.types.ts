import { AuthAccount, RefreshToken } from "../entities";
import { PoolClient } from "pg";

export type AuthRepo = {
  createRt: (
    data: Pick<
      RefreshToken,
      "token_hash" | "user_id" | "family_id" | "expires_at"
    >,
    client?: PoolClient,
  ) => Promise<void>;

  getRt: (
    data: Pick<RefreshToken, "token_hash">,
  ) => Promise<RefreshToken | undefined>;

  getRtForUpdate: (
    data: Pick<RefreshToken, "token_hash">,
    client: PoolClient,
  ) => Promise<RefreshToken | undefined>;

  revokeRt: (
    by: Pick<RefreshToken, "token_hash"> | Pick<RefreshToken, "family_id">,
    reason: Exclude<RefreshToken["revoked_reason"], null>,
    client?: PoolClient,
  ) => Promise<void>;

  createAuthAccount: (
    data: Omit<AuthAccount, "auth_account_id" | "created_at" | "updated_at">,
    client: PoolClient,
  ) => Promise<void>;

  getAuthAccountWithPassword: (
    data: Pick<AuthAccount, "provider" | "provider_account_id">,
  ) => Promise<AuthAccount | undefined>;

  getAuthAccount: (
    data: Pick<AuthAccount, "provider" | "provider_account_id">,
  ) => Promise<Omit<AuthAccount, "password_hash"> | undefined>;
};
