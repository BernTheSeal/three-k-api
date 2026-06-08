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

  findByToken: (
    data: Pick<RefreshToken, "token_hash">,
    tx?: FindTxOptions,
  ) => Promise<RefreshToken | undefined>;

  findByTokenWithAuthAccount: (
    data: Pick<RefreshToken, "token_hash">,
    tx?: FindTxOptions,
  ) => Promise<(RefreshToken & AuthAccount) | undefined>;

  revoke: (
    data: {
      by: Pick<RefreshToken, "token_hash"> | Pick<RefreshToken, "family_id">;
      reason: Exclude<RefreshToken["revoked_reason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeAll: (
    data: Pick<RefreshToken, "auth_account_id"> & {
      revoked_reason: Exclude<RefreshToken["revoked_reason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;

  revokeAllExceptCurrent: (
    data: {
      auth_account_id: number;
      reason: Exclude<RefreshToken["revoked_reason"], null>;
      except_family_id: string;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;
};
