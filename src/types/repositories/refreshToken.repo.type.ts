import { RefreshToken } from "../entities";
import { MutateTxOptions, FindTxOptions } from "./common.repo.type";

export type RefreshTokenRepo = {
  create: (
    data: Pick<
      RefreshToken,
      "token_hash" | "user_id" | "family_id" | "expires_at"
    >,
    tx?: MutateTxOptions,
  ) => Promise<RefreshToken>;

  findByToken: (
    data: Pick<RefreshToken, "token_hash">,
    tx?: FindTxOptions,
  ) => Promise<RefreshToken | undefined>;

  revoke: (
    data: {
      by: Pick<RefreshToken, "token_hash"> | Pick<RefreshToken, "family_id">;
      reason: Exclude<RefreshToken["revoked_reason"], null>;
    },
    tx?: MutateTxOptions,
  ) => Promise<void>;
};
