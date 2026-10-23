import { UNION_WORDS, MODAL_VERBS, LEMMA_EXCEPTIONS, OVERRIDE_POS } from "./lemmatize.map";
import { TryUnion, TryClassifyAux, TryOverridePos, TrySkipLemmatization } from "./lemmatize.helper.type";

const tryUnion: TryUnion = (input) => {
  const { curr, next } = input;

  const data = UNION_WORDS.get(curr.lemma);

  if (!data || data.second != next?.lemma) {
    return { success: false, newLemma: null, newPos: null, newSurfaceForm: null };
  }

  const withSuffix = data.withSuffix;

  if (withSuffix) {
    if (withSuffix === curr.surfaceForm) {
      return {
        success: true,
        newLemma: data.unionForm,
        newSurfaceForm: `${curr.surfaceForm} ${next.surfaceForm}`,
        newPos: data.pos,
      };
    } else {
      return { success: false, newLemma: null, newPos: null, newSurfaceForm: null };
    }
  }

  return {
    success: true,
    newLemma: data.unionForm,
    newSurfaceForm: `${curr.surfaceForm} ${next.surfaceForm}`,
    newPos: data.pos,
  };
};

const tryClassifyAux: TryClassifyAux = (input) => {
  const { lemma, pos } = input;
  const isExists = MODAL_VERBS.has(lemma);

  if (!isExists || pos != "auxiliary verb") {
    return { success: false, newPos: null };
  }

  return { success: true, newPos: "modal verb" };
};

const trySkipLemmatization: TrySkipLemmatization = (input) => {
  const { surfaceForm } = input;
  const isLemmaException = LEMMA_EXCEPTIONS.has(surfaceForm);

  if (!isLemmaException) {
    return { success: false, newLemma: null };
  }

  return { success: true, newLemma: surfaceForm };
};

const tryOverridePos: TryOverridePos = (input) => {
  const { lemma } = input;

  const newPos = OVERRIDE_POS.get(lemma);

  if (!newPos) {
    return { success: false, newPos: null };
  }

  return { success: true, newPos };
};

export const lemmatizeHelper = {
  tryUnion,
  tryClassifyAux,
  trySkipLemmatization,
  tryOverridePos,
};
