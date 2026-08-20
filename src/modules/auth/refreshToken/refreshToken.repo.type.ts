import { AuthAccountEntity, RefreshTokenEntity } from "@/shared/types/entities";
import { MutateTxOptions, FindTxOptions } from "@/shared/types/transaction.type";

type CreateParams = Pick<RefreshTokenEntity, "tokenHash" | "authAccountId" | "familyId" | "expiresAt">;
type CreateResult = Promise<RefreshTokenEntity>;
export type Create = (params: CreateParams, tx?: MutateTxOptions) => CreateResult;

type FindByTokenHashParams = Pick<RefreshTokenEntity, "tokenHash">;
type FindByTokenHashResult = Promise<RefreshTokenEntity | undefined>;
export type FindByTokenHash = (params: FindByTokenHashParams, tx?: FindTxOptions) => FindByTokenHashResult;

type FindByTokenHashWithAuthAccountParams = Pick<RefreshTokenEntity, "tokenHash">;
type FindByTokenHashWithAuthAccountResult = Promise<(RefreshTokenEntity & AuthAccountEntity) | undefined>;
export type FindByTokenHashWithAuthAccount = (
  params: FindByTokenHashWithAuthAccountParams,
  tx?: FindTxOptions,
) => FindByTokenHashWithAuthAccountResult;

type RevokeByTokenHashParams = Pick<RefreshTokenEntity, "tokenHash"> & {
  revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
};
export type RevokeByTokenHash = (params: RevokeByTokenHashParams, tx?: MutateTxOptions) => Promise<void>;

type RevokeByFamilyIdParams = Pick<RefreshTokenEntity, "familyId"> & {
  revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
};
export type RevokeByFamilyId = (params: RevokeByFamilyIdParams, tx?: MutateTxOptions) => Promise<void>;

type RevokeByAuthAccountIdParams = Pick<RefreshTokenEntity, "authAccountId"> & {
  revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
};
export type RevokeByAuthAccountId = (params: RevokeByAuthAccountIdParams, tx?: MutateTxOptions) => Promise<void>;

type RevokeByAuthAccountIdExceptFamilyIdParams = Pick<RefreshTokenEntity, "authAccountId" | "familyId"> & {
  revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
};
export type RevokeByAuthAccountIdExceptFamilyId = (
  params: RevokeByAuthAccountIdExceptFamilyIdParams,
  tx?: MutateTxOptions,
) => Promise<void>;
