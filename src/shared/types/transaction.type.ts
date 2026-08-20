import { PoolClient } from "pg";

type MutateTxOptions = {
  client?: PoolClient;
};

type FindTxOptions =
  | { client: PoolClient; lock: true }
  | { client?: PoolClient; lock?: false };

export { MutateTxOptions, FindTxOptions };
