import { getExecutor } from "@/shared/lib/db/db.provider";
import { CreateBulk } from "./sentenceWord.repo.type";

const createBulk: CreateBulk = async (params, tx) => {
  const { sentenceId, words, indexes } = params;
  const executor = getExecutor(tx?.client);

  await executor(
    `
  INSERT INTO sentence_words (sentence_id, word_id, surface_form)
  SELECT $1, t.word_id, t.surface_form
  FROM unnest($2::int[], $3::text[]) AS t(word_id, surface_form)
  `,
    [sentenceId, indexes, words],
  );
};

export const sentenceWordRepo = {
  createBulk,
};
