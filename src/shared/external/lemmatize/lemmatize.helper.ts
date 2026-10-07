import { LemmatizeEntity } from "./lemmatize.type";
import { CONVERT_DET_TO, UNION_WORDS, MODAL_VERBS } from "./lemmatize.map";
import { PosEntity } from "@/shared/types/entities";

type TryClassifyDet = (input: LemmatizeEntity) =>
  | {
      newPos: Extract<LemmatizeEntity["pos"], "definite article" | "indefinite article">;
      success: true;
    }
  | {
      newPos: null;
      success: false;
    };

export const tryClassifyDet: TryClassifyDet = (input) => {
  const { lemma, pos } = input;
  const newPos = CONVERT_DET_TO.get(lemma);

  if (pos != "determiner" || !newPos) {
    return {
      newPos: null,
      success: false,
    };
  }

  return { newPos, success: true };
};

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
