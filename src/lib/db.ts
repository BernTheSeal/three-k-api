import { Pool, QueryResult, QueryResultRow, PoolClient } from "pg";
import { env } from "../config/env";

const pool = new Pool({
  user: env.db.user,
  host: env.db.host,
  database: env.db.name,
  password: env.db.password,
  port: parseInt(env.db.port || "5432", 10),
  max: 10,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

/**
 * @template T
 */

export const query = async <T extends QueryResultRow>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>> => {
  return await pool.query<T>(text, params);
};

export const getExecutor = <T extends QueryResultRow>(client?: PoolClient) => {
  return client
    ? (text: string, params: any[]) => client.query<T>(text, params)
    : (text: string, params: any[]) => query<T>(text, params);
};

export const withTransaction = async <T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> => {
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
