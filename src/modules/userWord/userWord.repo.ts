import { getExecutor } from "@/shared/lib/db/db.provider";

import { Create, Remove, Update } from "./userWord.repo.type";

import { UserWordEntity } from "@/shared/types/entities";

const create: Create = async (params, tx) => {
  const { userId, wordId, status, note, isFavorite } = params;

  const executor = getExecutor<UserWordEntity>(tx?.client);

  const response = await executor(
    `
    INSERT INTO user_words(user_id, word_id, status, is_favorite, note) 
    values($1, $2, $3, $4, $5)
    RETURNING *;
  `,
    [userId, wordId, status, isFavorite, note],
  );

  return response.rows[0]!;
};

const remove: Remove = async (params, tx) => {
  const { wordId, userId } = params;

  const executor = getExecutor<Pick<UserWordEntity, "wordId">>(tx?.client);

  const response = await executor(
    `
    DELETE FROM user_words 
    WHERE user_id = $1 AND word_id = $2 
    RETURNING word_id
  `,
    [userId, wordId],
  );

  return response.rows[0];
};

const update: Update = async (params, tx) => {
  const { userId, wordId, ...conditions } = params;

  const queryConditions: string[] = [];

  const queryParams: any[] = [userId, wordId];

  const conditionFields = Object.keys(conditions) as (keyof typeof conditions)[];

  for (const f of conditionFields) {
    queryParams.push(conditions[f]);

    const snakeCaseF = f.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    const condition = `${snakeCaseF} = $${queryParams.length}`;
    queryConditions.push(condition);
  }

  const conditionsForSql = queryConditions.join(", ");

  const executor = getExecutor<UserWordEntity>(tx?.client);

  const response = await executor(
    `
    UPDATE user_words
    SET
      updated_at = NOW(),
      ${conditionsForSql}
    WHERE user_id = $1 AND word_id = $2
    RETURNING *
  `,
    queryParams,
  );

  return response.rows[0];
};

export const userWordRepo = {
  create,
  remove,
  update,
};
