import { getExecutor, getLock } from "../lib/db";
import { User } from "../types/entities/user";
import { UserRepo } from "../types/repositories/user.repo.type";

export const userRepo: UserRepo = {
  async create(data, tx) {
    const { username, is_active } = data;

    const executor = getExecutor<User>(tx?.client);

    const response = await executor(
      `INSERT INTO users (username , is_active)
        VALUES($1, $2)
        RETURNING *
        `,
      [username, is_active],
    );

    return response.rows[0]!;
  },

  async findById(data, tx) {
    const { user_id } = data;

    const executor = getExecutor<User>(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM users
      WHERE user_id = $1
      ${lock}
    `,
      [user_id],
    );

    return response.rows[0];
  },

  async activateById(data, tx) {
    const { user_id } = data;

    const executor = getExecutor(tx?.client);

    await executor(
      `
      UPDATE users
      SET is_active = true, updated_at = NOW()
      WHERE user_id = $1
      `,
      [user_id],
    );
  },
};
