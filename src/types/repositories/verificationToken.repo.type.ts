import { VerificationToken } from "../entities";
import { AuthAccount } from "../entities";
import { FindTxOptions, MutateTxOptions } from "./common.repo.type";

export type VerificationTokenRepo = {
  create: (
    data: Pick<
      VerificationToken,
      "auth_account_id" | "token_hash" | "token_type" | "expires_at"
    >,
    tx?: MutateTxOptions,
  ) => Promise<VerificationToken>;

  findByUserId: (
    data: Pick<AuthAccount, "user_id"> &
      Pick<VerificationToken, "is_active" | "token_type">,
    tx?: FindTxOptions,
  ) => Promise<VerificationToken | undefined>;
  revoke: (
    data: Pick<VerificationToken, "auth_account_id" | "token_type">,
    tx?: MutateTxOptions,
  ) => Promise<void>;

  markAsUsedById: (
    data: Pick<VerificationToken, "verification_token_id">,
    tx?: MutateTxOptions,
  ) => Promise<void>;
};
