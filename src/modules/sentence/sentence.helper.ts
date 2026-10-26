import { SENTENCE_CONST } from "./sentence.const";
import { PUNC } from "@/shared/types/entities";
import { FindUnknownWordsInput, FindUnknownPosInput, FindPuncInARowInput, AddDisplayFlagsInput } from "./sentence.helper.type";

const findUnknownWords = (input: FindUnknownWordsInput[]) => {
  const unknownWords = [];

  for (let i = 0; i < input.length; i++) {
    const curr = input[i]!;

    const isValidPunc = curr.pos === PUNC && SENTENCE_CONST.ALLOWED_PUNC.has(curr.surfaceForm);

    if (curr.wordId || isValidPunc) {
      continue;
    }

    unknownWords.push({
      position: i,
      lemma: curr.lemma,
      surfaceForm: curr.surfaceForm,
    });
  }

  return unknownWords;
};

const findUnknownPos = (input: FindUnknownPosInput[]) => {
  const unknownPos = [];

  for (let i = 0; i < input.length; i++) {
    const curr = input[i]!;

    if (!SENTENCE_CONST.ALLOWED_POS.has(curr.pos)) {
      unknownPos.push({ pos: curr.pos, position: i });
    }
  }

  return unknownPos;
};

const findPuncInARow = (input: FindPuncInARowInput[]) => {
  const puncInARow = [];

  for (let i = 1; i < input.length; i++) {
    const curr = input[i]!;
    const prev = input[i - 1]!;

    if (curr.pos === PUNC && prev.pos === PUNC) {
      puncInARow.push({
        position: i,
        lemma: curr.lemma,
        surfaceForm: curr.surfaceForm,
      });
    }
  }

  return puncInARow;
};

const addDisplayFlags = <I extends AddDisplayFlagsInput>(input: I[]) => {
  return input.map((e, i, arr) => {
    const curr = e;
    const prev = arr[i - 1];

    const isCapitalize = curr.surfaceForm === "i" || !prev || SENTENCE_CONST.SENTENCE_END.has(prev.surfaceForm);
    const isMergePrev = SENTENCE_CONST.CONTRACTIONS.has(curr.surfaceForm) || SENTENCE_CONST.ATTACH_PUNC.has(curr.surfaceForm);
    const isPunc = curr.pos === PUNC;

    return { ...e, isCapitalize, isMergePrev, isPunc, position: i };
  });
};

export const sentenceHelper = {
  findUnknownWords,
  findUnknownPos,
  findPuncInARow,
  addDisplayFlags,
};
