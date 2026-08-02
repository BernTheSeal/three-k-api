import { UserEntity } from "../../types/entities";
import { MutateTxOptions, FindTxOptions } from "./common.repo.type";

export type Create = (params: Pick<UserEntity, "username" | "isActive">, tx?: MutateTxOptions) => Promise<UserEntity>;

export type FindById = (params: Pick<UserEntity, "userId">, tx?: FindTxOptions) => Promise<UserEntity | undefined>;

export type ActivateById = (params: Pick<UserEntity, "userId">, tx?: MutateTxOptions) => Promise<void>;
