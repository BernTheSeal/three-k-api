import { getExecutor, getLock, toCamelCase } from "@/shared/lib/db.lib";
import { Create, FindById, ActivateById } from "@/shared/types/repositories/user.repo.type";
import { UserEntity } from "@/shared/types/entities";

const create: Create = async (params, tx) => {
  const { username, isActive } = params;

  const executor = getExecutor(tx?.client);

  const response = await executor(
    `INSERT INTO users (username , is_active)
        VALUES($1, $2)
        RETURNING *
        `,
    [username, isActive],
  );

  const res = toCamelCase<UserEntity>(response.rows);

  return res[0]!;
};

const findById: FindById = async (params, tx) => {
  const { userId } = params;

  const executor = getExecutor(tx?.client);
  const lock = getLock(tx?.lock);

  const response = await executor(
    `
      SELECT * FROM users
      WHERE user_id = $1
      ${lock}
    `,
    [userId],
  );

  const res = toCamelCase<UserEntity>(response.rows);

  return res[0];
};

const activateById: ActivateById = async (params, tx) => {
  const { userId } = params;

  const executor = getExecutor(tx?.client);

  await executor(
    `
      UPDATE users
      SET is_active = true, updated_at = NOW()
      WHERE user_id = $1
      `,
    [userId],
  );
};

export const userRepo = {
  create,
  findById,
  activateById,
};
