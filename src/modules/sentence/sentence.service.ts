import { wordCache } from "../word/word.cache";
import { BadRequestError, NotFoundError } from "@/shared/errors";
import { withTransaction } from "@/shared/lib/db/db.provider";
import { sentenceRepo } from "./sentence.repo";
import { sentenceWordRepo } from "./sentenceWords/sentenceWord.repo";
import { Create } from "./sentence.service.type";
import { clearSentence } from "./sentence.utils";
import { lemmatizeProvider } from "@/shared/external/lemmatize/lemmatize.provider";

const create: Create = async (input) => {
  const { content, userId } = input;

  const clearedSentence = clearSentence(content);

  if (clearedSentence.length === 0) {
    throw new BadRequestError({
      message: "Sentence must contain at least one English word.",
      code: "SENTENCE_HAS_NO_WORDS",
    });
  }

  const lemmatizedSentence = await lemmatizeProvider.lemmatize(clearedSentence);

  const wordsLemmas = lemmatizedSentence.map((w) => w.lemma.toLowerCase());

  const wordsIds = await wordCache.getIndexMany(wordsLemmas);

  const unknownWords: { lemma: string; text: string }[] = [];
  const knownWords: { wordId: number; surfaceForm: string }[] = [];

  wordsIds.forEach((wi, i) => {
    const item = lemmatizedSentence[i]!;

    if (item.pos === "proper noun") {
      return;
    }

    if (wi == null) {
      unknownWords.push({ lemma: item.lemma, text: item.text });
    } else {
      knownWords.push({ wordId: wi, surfaceForm: item.text });
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
        wordIds: knownWords.map((kw) => kw.wordId),
        surfaceForms: knownWords.map((kw) => kw.surfaceForm),
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
