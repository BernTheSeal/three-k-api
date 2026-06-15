import { AuthAccount, RefreshToken } from "../entities";
import { MutateTxOptions, FindTxOptions } from "./common.repo.type";

export type RefreshTokenRepo = {
  create: (
    data: Pick<
      RefreshToken,
      "token_hash" | "auth_account_id" | "family_id" | "expires_at"
    >,
    tx?: MutateTxOptions,
  ) => Promise<RefreshToken>;

  findByTokenHash: (
    data: Pick<RefreshToken, "token_hash">,
    tx?: FindTxOptions,
  ) => Promise<RefreshToken | undefined>;

  findByTokenHashWithAuthAccount: (
    data: Pick<RefreshToken, "token_hash">,
    tx?: FindTxOptions,
  ) => Promise<(RefreshToken & AuthAccount) | undefined>;

  revokeByTokenHash: (
    data: Pick<RefreshToken, "token_hash"> & {
      revoked_reason: Exclude<RefreshToken["revoked_reason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeByFamilyId: (
    data: Pick<RefreshToken, "family_id"> & {
      revoked_reason: Exclude<RefreshToken["revoked_reason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeByAuthAccountId: (
    data: Pick<RefreshToken, "auth_account_id"> & {
      revoked_reason: Exclude<RefreshToken["revoked_reason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeByAuthAccountIdExceptFamilyId: (
    data: Pick<RefreshToken, "auth_account_id" | "family_id"> & {
      revoked_reason: Exclude<RefreshToken["revoked_reason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;
};
