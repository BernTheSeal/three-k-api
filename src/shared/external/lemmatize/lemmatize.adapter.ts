import { lemmatizeClient } from "./lemmatize.client";
import { NLP_POS_TO_LEMMATIZE_POS } from "./lemmatize.map";
import { lemmatizeHelper } from "./lemmatize.helper";

const lemmatize = async (sentence: string) => {
  const lemmatizedSentence = await lemmatizeClient(sentence);

  const result = [];

  for (let i = 0; i < lemmatizedSentence.length; i++) {
    const { lemma, pos, surfaceForm, isOov } = lemmatizedSentence[i]!;

    let currLemma = lemma;
    let currPos = NLP_POS_TO_LEMMATIZE_POS[pos];
    let currSurfaceForm = surfaceForm;

    const skipLemmatization = lemmatizeHelper.trySkipLemmatization({ surfaceForm });

    if (skipLemmatization.success) {
      currLemma = skipLemmatization.newLemma;
    }

    const union = lemmatizeHelper.tryUnion({
      curr: {
        lemma: currLemma,
        surfaceForm: currSurfaceForm,
      },
      next: {
        lemma: lemmatizedSentence[i + 1]?.lemma,
        surfaceForm: lemmatizedSentence[i + 1]?.surfaceForm,
      },
    });

    if (union.success) {
      currPos = union.newPos;
      currLemma = union.newLemma;
      currSurfaceForm = union.newSurfaceForm;
      i++;
    }

    const auxilaryVerb = lemmatizeHelper.tryClassifyAux({ lemma: currLemma, pos: currPos });

    if (auxilaryVerb.success) {
      currPos = auxilaryVerb.newPos;
    }

    const override = lemmatizeHelper.tryOverridePos({ lemma });

    if (override.success) {
      currPos = override.newPos;
    }

    result.push({ lemma: currLemma, pos: currPos, surfaceForm: currSurfaceForm, isOov });
  }

  return result;
};

export const lemmatizeAdapter = {
  lemmatize,
};
