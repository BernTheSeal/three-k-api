import { UserEntity } from "@/shared/types/entities";
import { MutateTxOptions, FindTxOptions } from "@/shared/types/transaction.type";

type CreateParams = Pick<UserEntity, "username" | "isActive">;
type CreateResult = Promise<UserEntity>;
export type Create = (params: CreateParams, tx?: MutateTxOptions) => CreateResult;

type FindByIdParams = Pick<UserEntity, "userId">;
type FindByIdResult = Promise<UserEntity | undefined>;
export type FindById = (params: FindByIdParams, tx?: FindTxOptions) => FindByIdResult;

type ActivateByIdParams = Pick<UserEntity, "userId">;
export type ActivateById = (params: ActivateByIdParams, tx?: MutateTxOptions) => Promise<void>;
