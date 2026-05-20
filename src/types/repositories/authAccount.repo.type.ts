import { AuthAccount } from "../entities";
import { FindTxOptions, MutateTxOptions } from "./common.repo.type";

export type AuthAccountRepo = {
  create: (
    data: Omit<AuthAccount, "auth_account_id" | "created_at" | "updated_at">,
    tx?: MutateTxOptions,
  ) => Promise<AuthAccount>;

  findByProviderAccountId: (
    data: Pick<AuthAccount, "provider_account_id" | "provider">,
    tx?: FindTxOptions,
  ) => Promise<AuthAccount | undefined>;

  findByUserId: (
    data: Pick<AuthAccount, "user_id" | "provider">,
    tx?: FindTxOptions,
  ) => Promise<AuthAccount | undefined>;

  verifyById: (
    data: Pick<AuthAccount, "auth_account_id">,
    tx?: MutateTxOptions,
  ) => Promise<void>;
};
