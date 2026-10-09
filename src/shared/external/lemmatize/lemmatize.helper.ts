import { LemmatizeEntity } from "./lemmatize.type";
import { UNION_WORDS, MODAL_VERBS, LEMMA_EXCEPTIONS, OVERRIDE_POS } from "./lemmatize.map";
import { PosEntity } from "@/shared/types/entities";

type TryUnion = (input: {
  curr: { lemma: string; text: string };
  next?: { lemma?: string; text?: string };
}) =>
  | { success: true; newLemma: string; newPos: PosEntity["pos"]; newText: string }
  | { success: false; newLemma: null; newPos: null; newText: null };

export const tryUnion: TryUnion = (input) => {
  const { curr, next } = input;

  const data = UNION_WORDS.get(curr.lemma);

  if (!data || data.second != next?.lemma) {
    return { success: false, newLemma: null, newPos: null, newText: null };
  }

  const withSuffix = data.withSuffix;

  if (withSuffix) {
    if (withSuffix === curr.text) {
      return {
        success: true,
        newLemma: data.unionForm,
        newText: `${curr.text} ${next.text}`,
        newPos: data.pos,
      };
    } else {
      return { success: false, newLemma: null, newPos: null, newText: null };
    }
  }

  return {
    success: true,
    newLemma: data.unionForm,
    newText: `${curr.text} ${next.text}`,
    newPos: data.pos,
  };
};

type TryClassifyAux = (
  input: Pick<LemmatizeEntity, "lemma" | "pos">,
) => { success: true; newPos: "modal verb" } | { success: false; newPos: null };

export const tryClassifyAux: TryClassifyAux = (input) => {
  const { lemma, pos } = input;
  const isExists = MODAL_VERBS.has(lemma);

  if (!isExists || pos != "auxiliary verb") {
    return { success: false, newPos: null };
  }

  return { success: true, newPos: "modal verb" };
};

type TrySkipLemmatization = (input: { text: string }) => { success: true; newLemma: string } | { success: false; newLemma: null };

export const trySkipLemmatization: TrySkipLemmatization = (input) => {
  const { text } = input;
  const isLemmaException = LEMMA_EXCEPTIONS.has(text);

  if (!isLemmaException) {
    return { success: false, newLemma: null };
  }

  return { success: true, newLemma: text };
};

type TryOverridePos = (input: {
  lemma: string;
}) => { success: true; newPos: PosEntity["pos"] } | { success: false; newPos: null };

export const tryOverridePos: TryOverridePos = (input) => {
  const { lemma } = input;

  const newPos = OVERRIDE_POS.get(lemma);

  if (!newPos) {
    return { success: false, newPos: null };
  }

  return { success: true, newPos };
};
