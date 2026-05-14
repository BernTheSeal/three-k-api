import { User } from "../entities";
import { PoolClient } from "pg";

export type UserRepo = {
  create: (
    data: Pick<User, "username" | "is_active">,
    client?: PoolClient,
  ) => Promise<Pick<User, "user_id" | "is_active">>;
  getById: (data: Pick<User, "user_id">) => Promise<User | undefined>;
};
