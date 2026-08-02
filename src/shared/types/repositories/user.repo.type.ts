import { UserEntity } from "../../types/entities";
import { MutateTxOptions, FindTxOptions } from "./common.repo.type";

export type UserRepo = {
  create: (data: Pick<UserEntity, "username" | "isActive">, tx?: MutateTxOptions) => Promise<UserEntity>;

  findById: (data: Pick<UserEntity, "userId">, tx?: FindTxOptions) => Promise<UserEntity | undefined>;

  activateById: (data: Pick<UserEntity, "userId">, tx?: MutateTxOptions) => Promise<void>;
};
