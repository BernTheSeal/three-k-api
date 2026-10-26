import { pool } from "./db.client";
import { PoolClient, DatabaseError } from "pg";
import { dbHelper } from "./db.helper";
import { ExternalServiceError } from "@/shared/errors";

const run = async (client: PoolClient | undefined, text: string, params?: any[]) => {
  try {
    const exec = client ?? pool;
    return await exec.query(text, params);
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw dbHelper.errorMapper(error);
    }

    throw new ExternalServiceError({
      message: "Database is unreachable",
      code: "DATABASE_UNAVAILABLE",
      service: "DATABASE",
      cause: error,
    });
  }
};

const getExecutor = <T extends Record<string, unknown>>(client?: PoolClient) => {
  return async (text: string, params: any[] = []) => {
    const res = await run(client, text, params);
    return { ...res, rows: dbHelper.toCamelCase<T>(res.rows) };
  };
};

const getLock = (lock?: boolean) => (lock ? "FOR UPDATE" : "");

const withTransaction = async <T>(fn: (client: PoolClient) => Promise<T>): Promise<T> => {
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

export const dbProvider = {
  getExecutor,
  getLock,
  withTransaction,
};
