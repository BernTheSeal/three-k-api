import { lemmatizeClient } from "@/shared/external/lemmatize/lemmatize.client";
import { wordCache } from "../word/word.cache";
import { BadRequestError, NotFoundError } from "@/shared/errors";
import { withTransaction } from "@/shared/lib/db/db.provider";
import { sentenceRepo } from "./sentence.repo";
import { sentenceWordRepo } from "./sentenceWords/sentenceWord.repo";
import { Create } from "./sentence.service.type";
import { clearSentence } from "./sentence.utils";

const create: Create = async (input) => {
  const { content, userId } = input;

  const clearedSentence = clearSentence(content);

  if (clearedSentence.length === 0) {
    throw new BadRequestError({
      message: "Sentence must contain at least one English word.",
      code: "SENTENCE_HAS_NO_WORDS",
    });
  }

  const lemmatizedSentence = await lemmatizeClient(clearedSentence);

  const wordsIdx = await wordCache.getIndexMany(lemmatizedSentence.map((l) => l.lemma.toLowerCase()));

  const unknownWords: { lemma: string; text: string }[] = [];
  const knownIdx: number[] = [];

  wordsIdx.forEach((w, i) => {
    if (w == null) {
      const item = lemmatizedSentence[i]!;
      unknownWords.push({ lemma: item.lemma, text: item.text });
    } else {
      knownIdx.push(w);
    }
  });

  if (unknownWords.length >= 1) {
    throw new NotFoundError({
      message: "Sentence contains words that are not in the 3K word list.",
      code: "WORDS_NOT_IN_THREE_K",
      details: unknownWords,
    });
  }

  const cretedSentence = await withTransaction(async (client) => {
    const sentenceResponse = await sentenceRepo.create({ userId, content }, { client });
    await sentenceWordRepo.createBulk(
      {
        sentenceId: sentenceResponse.sentenceId,
        indexes: knownIdx,
        words: lemmatizedSentence.map((l) => l.text),
      },
      { client },
    );

    return sentenceResponse;
  });

  return cretedSentence;
};

export const sentenceService = {
  create,
};
