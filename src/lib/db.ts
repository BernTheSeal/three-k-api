import { Pool, QueryResult, QueryResultRow, PoolClient } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

/**
 * @template T
 */

export const query = async <T extends QueryResultRow>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>> => {
  try {
    const res = await pool.query<T>(text, params);
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
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
