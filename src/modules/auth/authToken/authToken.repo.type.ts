import { AuthTokenEntity } from "@/shared/types/entities";
import { FindTxOptions, MutateTxOptions } from "@/shared/types/transaction.type";

type CreateParams = Pick<AuthTokenEntity, "authAccountId" | "tokenHash" | "tokenType" | "expiresAt">;
type CreateResult = Promise<AuthTokenEntity>;
export type Create = (params: CreateParams, tx?: MutateTxOptions) => CreateResult;

type FindByTokenParams = Pick<AuthTokenEntity, "tokenHash">;
type FindByTokenResult = Promise<AuthTokenEntity | undefined>;
export type FindByToken = (params: FindByTokenParams, tx?: FindTxOptions) => FindByTokenResult;

type RevokeParams = Pick<AuthTokenEntity, "authAccountId" | "tokenType">;
export type Revoke = (params: RevokeParams, tx?: MutateTxOptions) => Promise<void>;

type MarkAsUsedParams = Pick<AuthTokenEntity, "authTokenId">;
export type MarkAsUsed = (params: MarkAsUsedParams, tx?: MutateTxOptions) => Promise<void>;
