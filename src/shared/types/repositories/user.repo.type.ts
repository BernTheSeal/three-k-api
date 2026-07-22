import { User } from "../../types/entities";
import { MutateTxOptions, FindTxOptions } from "./common.repo.type";

export type UserRepo = {
  create: (data: Pick<User, "username" | "is_active">, tx?: MutateTxOptions) => Promise<User>;

  findById: (data: Pick<User, "user_id">, tx?: FindTxOptions) => Promise<User | undefined>;

  activateById: (data: Pick<User, "user_id">, tx?: MutateTxOptions) => Promise<void>;
};
