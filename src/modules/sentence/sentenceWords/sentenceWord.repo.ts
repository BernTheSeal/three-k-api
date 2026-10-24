import { dbProvider } from "@/shared/lib/db";
import { CreateBulk } from "./sentenceWord.repo.type";

const createBulk: CreateBulk = async (params, tx) => {
  const { sentenceId, sentenceWords } = params;
  const executor = dbProvider.getExecutor(tx?.client);

  await executor(
    `
    INSERT INTO sentence_words (
      sentence_id, word_id, pos_id, surface_form, position, is_merge_prev, is_capitalize, is_punc
    )

    SELECT
      $1,
      t.word_id,
      t.pos_id,
      t.surface_form,
      t.position,
      t.is_merge_prev,
      t.is_capitalize,
      t.is_punc

    FROM unnest(
      $2::int[],
      $3::int[],
      $4::text[],
      $5::int[],
      $6::boolean[],
      $7::boolean[],
      $8::boolean[]
    ) AS t(word_id, pos_id, surface_form, position, is_merge_prev, is_capitalize, is_punc)

    `,
    [
      sentenceId,
      sentenceWords.map((sw) => sw.wordId),
      sentenceWords.map((sw) => sw.posId),
      sentenceWords.map((sw) => sw.surfaceForm),
      sentenceWords.map((sw) => sw.position),
      sentenceWords.map((sw) => sw.isMergePrev),
      sentenceWords.map((sw) => sw.isCapitalize),
      sentenceWords.map((sw) => sw.isPunc),
    ],
  );
};

export const sentenceWordRepo = {
  createBulk,
};
