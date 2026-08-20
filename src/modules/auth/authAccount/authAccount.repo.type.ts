import { AuthAccountEntity, LocalAuthAccount } from "@/shared/types/entities";
import { FindTxOptions, MutateTxOptions } from "@/shared/types/transaction.type";

type CreateParams = Omit<AuthAccountEntity, "authAccountId" | "createdAt" | "updatedAt">;
type CreateResult = Promise<AuthAccountEntity>;
export type Create = (params: CreateParams, tx?: MutateTxOptions) => CreateResult;

type FindByIdParams = Pick<AuthAccountEntity, "authAccountId" | "provider">;
type FindByIdResult = Promise<AuthAccountEntity | undefined>;
export type FindById = (params: FindByIdParams, tx?: FindTxOptions) => FindByIdResult;

type FindByProviderAccountIdParams = Pick<AuthAccountEntity, "providerAccountId" | "provider">;
type FindByProviderAccountIdResult = Promise<AuthAccountEntity | undefined>;
export type FindByProviderAccountId = (
  params: FindByProviderAccountIdParams,
  tx?: FindTxOptions,
) => FindByProviderAccountIdResult;

type FindByEmailParams = Pick<AuthAccountEntity, "email" | "provider">;
type FindByEmailResult = Promise<AuthAccountEntity | undefined>;
export type FindByEmail = (params: FindByEmailParams, tx?: FindTxOptions) => FindByEmailResult;

type VerifyByIdParams = Pick<AuthAccountEntity, "authAccountId">;
export type VerifyById = (params: VerifyByIdParams, tx?: MutateTxOptions) => Promise<void>;

type UpdatePasswordParams = Pick<LocalAuthAccount, "authAccountId" | "passwordHash">;
export type UpdatePassword = (params: UpdatePasswordParams, tx?: MutateTxOptions) => Promise<void>;
