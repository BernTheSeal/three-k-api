import { lemmatizeClient } from "./lemmatize.client";
import { NLP_POS_TO_DB_POS } from "./lemmatize.map";
import { posCache } from "@/modules/pos/pos.cache";
import { tryClassifyAux, tryClassifyDet, tryUnion } from "./lemmatize.helper";

const lemmatize = async (sentence: string) => {
  const lemmatizedSentence = await lemmatizeClient(sentence);

  const result = [];

  for (let i = 0; i < lemmatizedSentence.length; i++) {
    const { lemma, pos, text } = lemmatizedSentence[i]!;

    let currLemma = lemma;
    let currPos = NLP_POS_TO_DB_POS[pos];
    let currText = text;

    const determiner = tryClassifyDet({ lemma: currLemma, pos: currPos });

    if (determiner.success) {
      currPos = determiner.newPos;
    }

    const union = tryUnion({
      curr: {
        lemma: currLemma,
        text: currText,
      },
      next: {
        lemma: lemmatizedSentence[i + 1]?.lemma,
        text: lemmatizedSentence[i + 1]?.text,
      },
    });

    if (union.success) {
      currPos = union.newPos;
      currLemma = union.newLemma;
      currText = union.newText;
      i++;
    }

    const auxilaryVerb = tryClassifyAux({ lemma: currLemma, pos: currPos });

    if (auxilaryVerb.success) {
      currPos = auxilaryVerb.newPos;
    }

    const posId = posCache.get(currPos);

    result.push({ lemma: currLemma, pos: currPos, text: currText, posId });
  }

  return result;
};

export const lemmatizeAdapter = {
  lemmatize,
};
