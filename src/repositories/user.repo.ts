import { query } from "../lib/db";
import { PoolClient } from "pg";
import { User } from "../types/entities/user";
import { getExecutor } from "../lib/db";

type UserRepo = {
  create: (
    data: Pick<User, "username" | "email" | "password_hash">,
    client?: PoolClient,
  ) => Promise<Omit<User, "password_hash">>;

  getWithPassword: (data: Pick<User, "email">) => Promise<User | undefined>;
};

export const userRepo: UserRepo = {
  async create(data, client) {
    const { username, email, password_hash } = data;

    const executor = getExecutor<Omit<User, "password_hash">>(client);

    const response = await executor(
      `INSERT INTO users (username, email, password_hash)
        VALUES($1, $2, $3)
        RETURNING user_id, email, username, google_id, photo_url, is_email_verified, created_at, updated_at
        `,
      [username, email, password_hash],
    );

    return response.rows[0]!;
  },

  async getWithPassword(data) {
    const { email } = data;
    const response = await query<User>(
      `
      SELECT 
        user_id, password_hash ,email, 
        username, google_id, photo_url, 
        is_email_verified, created_at, updated_at FROM users
      WHERE email = $1  
    `,
      [email],
    );

    return response.rows[0];
  },
};
