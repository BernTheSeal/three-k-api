import { AuthAccountEntity, LocalAuthAccount } from "../../types/entities";
import { FindTxOptions, MutateTxOptions } from "./common.repo.type";

export type Create = (
  params: Omit<AuthAccountEntity, "authAccountId" | "createdAt" | "updatedAt">,
  tx?: MutateTxOptions,
) => Promise<AuthAccountEntity>;

export type FindById = (
  params: Pick<AuthAccountEntity, "authAccountId" | "provider">,
  tx?: FindTxOptions,
) => Promise<AuthAccountEntity | undefined>;

export type FindByProviderAccountId = (
  params: Pick<AuthAccountEntity, "providerAccountId" | "provider">,
  tx?: FindTxOptions,
) => Promise<AuthAccountEntity | undefined>;

export type FindByEmail = (
  params: Pick<AuthAccountEntity, "email" | "provider">,
  tx?: FindTxOptions,
) => Promise<AuthAccountEntity | undefined>;

export type VerifyById = (params: Pick<AuthAccountEntity, "authAccountId">, tx?: MutateTxOptions) => Promise<void>;

export type UpdatePassword = (
  params: Pick<LocalAuthAccount, "authAccountId" | "passwordHash">,
  tx?: MutateTxOptions,
) => Promise<void>;
