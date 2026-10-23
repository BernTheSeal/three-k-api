import { pool } from "./db.client";
import { PoolClient, DatabaseError } from "pg";
import { errorMapper, toCamelCase } from "./db.helper";
import { ExternalServiceError } from "@/shared/errors";

const run = async (client: PoolClient | undefined, text: string, params?: any[]) => {
  try {
    const exec = client ?? pool;
    return await exec.query(text, params);
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw errorMapper(error);
    }

    throw new ExternalServiceError({
      message: "Database is unreachable",
      code: "DATABASE_UNAVAILABLE",
      service: "DATABASE",
      cause: error,
    });
  }
};

export const getExecutor = <T extends Record<string, unknown>>(client?: PoolClient) => {
  return async (text: string, params: any[] = []) => {
    const res = await run(client, text, params);
    return { ...res, rows: toCamelCase<T>(res.rows) };
  };
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
