import { pool } from "./db.client";
import { QueryResult, QueryResultRow, PoolClient, Pool } from "pg";

export const query = async (text: string, params?: any[]): Promise<QueryResult<QueryResultRow>> => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error("QUERY ERROR");
    console.error(error);
    throw error;
  }
};

const clientQuery = async (client: PoolClient, text: string, params?: any[]): Promise<QueryResult<QueryResultRow>> => {
  try {
    return await client.query(text, params);
  } catch (error) {
    console.error("CLIENT QUERY ERROR");
    console.error(error);
    throw error;
  }
};

export const getExecutor = (client?: PoolClient) => {
  return client
    ? (text: string, params: any[]) => clientQuery(client, text, params)
    : (text: string, params: any[]) => query(text, params);
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

export const toCamelCase = <T extends Record<string, unknown>>(rows: Record<string, unknown>[]): T[] => {
  const first = rows[0];

  if (!first) {
    return rows as T[];
  }

  const rowKeys = Object.keys(first);
  const keysMap = new Map<string, string>();

  for (const key of rowKeys) {
    const camelCase = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    keysMap.set(key, camelCase);
  }

  return rows.map((v) => {
    const newObj: Record<string, unknown> = {};

    for (const key of rowKeys) {
      const camelCaseKey = keysMap.get(key) ?? key;
      newObj[camelCaseKey] = v[key];
    }

    return newObj;
  }) as T[];
};
