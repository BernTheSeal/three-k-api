import { getExecutor } from "@/shared/lib/db/db.provider";
import { Create } from "./sentence.repo.type";
import { SentenceEntity } from "@/shared/types/entities";

const create: Create = async (params, tx) => {
  const { userId, content } = params;
  const executor = getExecutor<SentenceEntity>(tx?.client);

  const response = await executor(
    `
    INSERT INTO sentences (user_id, content)
    VALUES($1, $2)
    RETURNING *
    `,
    [userId, content],
  );

  return response.rows[0]!;
};

export const sentenceRepo = {
  create,
};
