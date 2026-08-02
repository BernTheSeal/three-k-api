import { AuthAccountEntity, RefreshTokenEntity } from "../../types/entities";
import { MutateTxOptions, FindTxOptions } from "./common.repo.type";

export type Create = (
  params: Pick<RefreshTokenEntity, "tokenHash" | "authAccountId" | "familyId" | "expiresAt">,
  tx?: MutateTxOptions,
) => Promise<RefreshTokenEntity>;

export type FindByTokenHash = (
  params: Pick<RefreshTokenEntity, "tokenHash">,
  tx?: FindTxOptions,
) => Promise<RefreshTokenEntity | undefined>;

export type FindByTokenHashWithAuthAccount = (
  params: Pick<RefreshTokenEntity, "tokenHash">,
  tx?: FindTxOptions,
) => Promise<(RefreshTokenEntity & AuthAccountEntity) | undefined>;

export type RevokeByTokenHash = (
  params: Pick<RefreshTokenEntity, "tokenHash"> & {
    revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
  },
  tx?: MutateTxOptions,
) => Promise<void>;

export type RevokeByFamilyId = (
  params: Pick<RefreshTokenEntity, "familyId"> & {
    revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
  },
  tx?: MutateTxOptions,
) => Promise<void>;

export type RevokeByAuthAccountId = (
  params: Pick<RefreshTokenEntity, "authAccountId"> & {
    revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
  },
  tx?: MutateTxOptions,
) => Promise<void>;

export type RevokeByAuthAccountIdExceptFamilyId = (
  data: Pick<RefreshTokenEntity, "authAccountId" | "familyId"> & {
    revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
  },
  tx?: MutateTxOptions,
) => Promise<void>;
