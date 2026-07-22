import { AuthToken } from "../../types/entities";

import { FindTxOptions, MutateTxOptions } from "./common.repo.type";

export type AuthTokenRepo = {
  create: (data: Pick<AuthToken, "auth_account_id" | "token_hash" | "token_type" | "expires_at">, tx?: MutateTxOptions) => Promise<AuthToken>;

  findByToken: (data: Pick<AuthToken, "token_hash">, tx?: FindTxOptions) => Promise<AuthToken | undefined>;

  revoke: (data: Pick<AuthToken, "auth_account_id" | "token_type">, tx?: MutateTxOptions) => Promise<void>;

  markAsUsed: (data: Pick<AuthToken, "auth_token_id">, tx?: MutateTxOptions) => Promise<void>;
};
