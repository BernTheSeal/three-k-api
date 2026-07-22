import { AuthAccount, LocalAuthAccount } from "../../types/entities";
import { FindTxOptions, MutateTxOptions } from "./common.repo.type";

export type AuthAccountRepo = {
  create: (data: Omit<AuthAccount, "auth_account_id" | "created_at" | "updated_at">, tx?: MutateTxOptions) => Promise<AuthAccount>;

  findById: (data: Pick<AuthAccount, "auth_account_id" | "provider">, tx?: FindTxOptions) => Promise<AuthAccount | undefined>;

  findByProviderAccountId: (data: Pick<AuthAccount, "provider_account_id" | "provider">, tx?: FindTxOptions) => Promise<AuthAccount | undefined>;

  findByEmail: (data: Pick<AuthAccount, "email" | "provider">, tx?: FindTxOptions) => Promise<AuthAccount | undefined>;

  verifyById: (data: Pick<AuthAccount, "auth_account_id">, tx?: MutateTxOptions) => Promise<void>;

  updatePassword: (data: Pick<LocalAuthAccount, "auth_account_id" | "password_hash">, tx?: MutateTxOptions) => Promise<void>;
};
