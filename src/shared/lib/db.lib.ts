import { poolConfig } from "../config/db.config";
import { QueryResult, QueryResultRow, PoolClient, Pool } from "pg";

const pool = new Pool(poolConfig);

export const query = async <T extends QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  return await pool.query<T>(text, params);
};

export const getExecutor = <T extends QueryResultRow>(client?: PoolClient) => {
  return client ? (text: string, params: any[]) => client.query<T>(text, params) : (text: string, params: any[]) => query<T>(text, params);
};

export const getLock = (lock?: boolean) => (lock ? "FOR UPDATE" : "");

export const withTransaction = async <T>(fn: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
