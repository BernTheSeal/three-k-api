import { query, getExecutor } from "../lib/db";
import { User } from "../types/entities/user";
import { UserRepo } from "../types/repositories/user.repo.type";

export const userRepo: UserRepo = {
  async create(data, client) {
    const { username, is_active } = data;

    const executor = getExecutor<Pick<User, "user_id" | "is_active">>(client);

    const response = await executor(
      `INSERT INTO users (username , is_active)
        VALUES($1, $2)
        RETURNING user_id, is_active
        `,
      [username, is_active],
    );

    return response.rows[0]!;
  },

  async getById(data) {
    const { user_id } = data;
    const response = await query<User>(
      `
      SELECT * FROM users
      WHERE user_id = $1
    `,
      [user_id],
    );

    return response.rows[0];
  },
};
