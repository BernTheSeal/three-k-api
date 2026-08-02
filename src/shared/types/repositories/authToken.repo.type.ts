import { AuthTokenEntity } from "../../types/entities";

import { FindTxOptions, MutateTxOptions } from "./common.repo.type";

export type AuthTokenRepo = {
  create: (
    data: Pick<AuthTokenEntity, "authAccountId" | "tokenHash" | "tokenType" | "expiresAt">,
    tx?: MutateTxOptions,
  ) => Promise<AuthTokenEntity>;

  findByToken: (data: Pick<AuthTokenEntity, "tokenHash">, tx?: FindTxOptions) => Promise<AuthTokenEntity | undefined>;

  revoke: (data: Pick<AuthTokenEntity, "authAccountId" | "tokenType">, tx?: MutateTxOptions) => Promise<void>;

  markAsUsed: (data: Pick<AuthTokenEntity, "authTokenId">, tx?: MutateTxOptions) => Promise<void>;
};
