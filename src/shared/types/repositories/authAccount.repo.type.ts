import { AuthAccountEntity, LocalAuthAccount } from "../../types/entities";
import { FindTxOptions, MutateTxOptions } from "./common.repo.type";

export type AuthAccountRepo = {
  create: (
    data: Omit<AuthAccountEntity, "authAccountId" | "createdAt" | "updatedAt">,
    tx?: MutateTxOptions,
  ) => Promise<AuthAccountEntity>;

  findById: (
    data: Pick<AuthAccountEntity, "authAccountId" | "provider">,
    tx?: FindTxOptions,
  ) => Promise<AuthAccountEntity | undefined>;

  findByProviderAccountId: (
    data: Pick<AuthAccountEntity, "providerAccountId" | "provider">,
    tx?: FindTxOptions,
  ) => Promise<AuthAccountEntity | undefined>;

  findByEmail: (
    data: Pick<AuthAccountEntity, "email" | "provider">,
    tx?: FindTxOptions,
  ) => Promise<AuthAccountEntity | undefined>;

  verifyById: (data: Pick<AuthAccountEntity, "authAccountId">, tx?: MutateTxOptions) => Promise<void>;

  updatePassword: (data: Pick<LocalAuthAccount, "authAccountId" | "passwordHash">, tx?: MutateTxOptions) => Promise<void>;
};
