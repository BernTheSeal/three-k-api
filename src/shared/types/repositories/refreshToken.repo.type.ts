import { AuthAccountEntity, RefreshTokenEntity } from "../../types/entities";
import { MutateTxOptions, FindTxOptions } from "./common.repo.type";

export type RefreshTokenRepo = {
  create: (
    data: Pick<RefreshTokenEntity, "tokenHash" | "authAccountId" | "familyId" | "expiresAt">,
    tx?: MutateTxOptions,
  ) => Promise<RefreshTokenEntity>;

  findByTokenHash: (data: Pick<RefreshTokenEntity, "tokenHash">, tx?: FindTxOptions) => Promise<RefreshTokenEntity | undefined>;

  findByTokenHashWithAuthAccount: (
    data: Pick<RefreshTokenEntity, "tokenHash">,
    tx?: FindTxOptions,
  ) => Promise<(RefreshTokenEntity & AuthAccountEntity) | undefined>;

  revokeByTokenHash: (
    data: Pick<RefreshTokenEntity, "tokenHash"> & {
      revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeByFamilyId: (
    data: Pick<RefreshTokenEntity, "familyId"> & {
      revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeByAuthAccountId: (
    data: Pick<RefreshTokenEntity, "authAccountId"> & {
      revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeByAuthAccountIdExceptFamilyId: (
    data: Pick<RefreshTokenEntity, "authAccountId" | "familyId"> & {
      revokedReason: Exclude<RefreshTokenEntity["revokedReason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;
};
