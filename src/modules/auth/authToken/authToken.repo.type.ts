import { AuthTokenEntity } from "@/shared/types/entities";
import { FindTxOptions, MutateTxOptions } from "@/shared/types/transaction.type";

export type Create = (
  params: Pick<AuthTokenEntity, "authAccountId" | "tokenHash" | "tokenType" | "expiresAt">,
  tx?: MutateTxOptions,
) => Promise<AuthTokenEntity>;

export type FindByToken = (
  params: Pick<AuthTokenEntity, "tokenHash">,
  tx?: FindTxOptions,
) => Promise<AuthTokenEntity | undefined>;

export type Revoke = (params: Pick<AuthTokenEntity, "authAccountId" | "tokenType">, tx?: MutateTxOptions) => Promise<void>;

export type MarkAsUsed = (params: Pick<AuthTokenEntity, "authTokenId">, tx?: MutateTxOptions) => Promise<void>;
