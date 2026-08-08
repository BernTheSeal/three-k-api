import { pool } from "./db.client";
import { QueryResult, PoolClient, DatabaseError } from "pg";
import { errorMapper, toCamelCase } from "./db.helper";

export const query = async <T extends Record<string, unknown>>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  try {
    const res = await pool.query(text, params);
    res.rows = toCamelCase<T>(res.rows);
    return res;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw errorMapper(error);
    }
    throw error;
  }
};

const clientQuery = async <T extends Record<string, unknown>>(
  client: PoolClient,
  text: string,
  params?: any[],
): Promise<QueryResult<T>> => {
  try {
    const res = await client.query(text, params);
    res.rows = toCamelCase<T>(res.rows);
    return res;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw errorMapper(error);
    }
    throw error;
  }
};

export const getExecutor = <T extends Record<string, unknown>>(client?: PoolClient) => {
  return client
    ? (text: string, params: any[]) => clientQuery<T>(client, text, params)
    : (text: string, params: any[]) => query<T>(text, params);
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
