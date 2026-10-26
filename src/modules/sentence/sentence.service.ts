import { Create } from "./sentence.service.type";
import { sentenceUtils } from "./sentence.util";
import { sentenceHelper } from "./sentence.helper";
import { sentenceRepo } from "./sentence.repo";
import { sentenceWordRepo } from "./sentenceWords/sentenceWord.repo";

import { wordService } from "@/modules/word";
import { posService } from "@/modules/pos";

import { lemmatizeAdapter } from "@/shared/external/lemmatize";
import { dbProvider } from "@/shared/lib/db/";
import { BadRequestError, InternalServerError, NotFoundError, UnprocessableContentError } from "@/shared/errors";
import { Pos } from "@/shared/types/entities";

const create: Create = async (input) => {
  const { sentence, userId } = input;

  const clearedSentence = sentenceUtils.clearSentence(sentence);
  const lemmatizedSentence = await lemmatizeAdapter.lemmatize(clearedSentence);
  const wordIndexes = await wordService.getWordIdsFromCache({ words: lemmatizedSentence.map((l) => l.lemma) });

  if (lemmatizedSentence.length !== wordIndexes.length) {
    throw new InternalServerError({
      message:
        "wordCache.getIndexMany returned a different number of results than the lemmas sent. " +
        "Either the lemmatize adapter produced an unexpected lemma list or the word cache dropped/added entries; " +
        "results are positional, so this cannot be processed.",
      code: "WORD_INDEX_LENGTH_MISMATCH",
      details: [
        {
          lemmatizedLength: lemmatizedSentence.length,
          wordIndexesLength: wordIndexes.length,
          sentence: clearedSentence,
        },
      ],
    });
  }

  const withWordIds = lemmatizedSentence.map((e, i) => ({ ...e, wordId: wordIndexes[i] ?? null }));

  const unknownWords = sentenceHelper.findUnknownWords(withWordIds);

  if (unknownWords.length > 0) {
    throw new NotFoundError({
      message: "Sentence passed validation, but some words were not found in the 3K word list.",
      code: "WORDS_NOT_FOUND",
      details: unknownWords,
    });
  }

  const unknownPos = sentenceHelper.findUnknownPos(withWordIds);

  if (unknownPos.length > 0) {
    throw new UnprocessableContentError({
      message:
        "Sentence passed the 3K word check, but lemmatizer tagged some words with a part of speech the system does not accept." +
        "Likely a tagging issue, rephrasing may help.",
      code: "WORDS_NOT_PROCESSABLE",
      details: unknownPos,
    });
  }

  const withIds = withWordIds.map((e, i) => {
    const posId = posService.getIdByPosFromCache({ pos: e.pos });

    if (!posId) {
      throw new InternalServerError({
        message:
          "Pos id not found in posCache for a pos that passed validation. " +
          "The cache is probably empty or incomplete: check that initializePosCache ran at startup and the pos table has all rows.",
        code: "POS_ID_NOT_FOUND",
        details: [{ pos: e.pos, position: i }],
      });
    }

    return { ...e, posId, pos: e.pos as Pos };
  });

  const puncInARow = sentenceHelper.findPuncInARow(withIds);

  if (puncInARow.length > 0) {
    throw new BadRequestError({
      message: "Sentence contains consecutive punctuation marks. Use a single punctuation mark between words.",
      code: "PUNCTUATION_IN_A_ROW",
      details: puncInARow,
    });
  }

  const withDisplayFlags = sentenceHelper.addDisplayFlags(withIds);

  const sentenceId = await dbProvider.withTransaction(async (client) => {
    const sentenceResponse = await sentenceRepo.create({ userId }, { client });
    sentenceWordRepo.createBulk({ sentenceId: sentenceResponse.sentenceId, sentenceWords: withDisplayFlags }, { client });
    return sentenceResponse.sentenceId;
  });

  const words = withDisplayFlags.map((e) => ({
    position: e.position,
    surfaceForm: e.surfaceForm,
    word: e.lemma,
    wordId: e.wordId,
    pos: e.pos,
    posId: e.posId,
    isMergePrev: e.isMergePrev,
    isCapitalize: e.isCapitalize,
    isPunc: e.isPunc,
  }));

  return { sentenceId, words };
};

export const sentenceService = {
  create,
};
