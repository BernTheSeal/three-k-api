import { lemmatizeClient } from "./lemmatize.client";
import { posCache } from "@/modules/pos/pos.cache";
import { POS_TAG_MAP } from "./lemmatize.map";
import { InternalServerError } from "@/shared/errors";

const lemmatize = async (sentence: string) => {
  const lemmatizedSentence = await lemmatizeClient(sentence);

  const clearedLemmatizedSentence = lemmatizedSentence.map((l) => {
    const pos = POS_TAG_MAP[l.pos];

    const posId = posCache.get(pos);

    if (posId == null && pos !== "proper noun") {
      throw new InternalServerError({
        message: `POS not found in cache: ${pos}`,
        code: "POS_NOT_FOUND_IN_CACHE",
      });
    }

    return {
      text: l.text,
      lemma: l.lemma,
      pos,
      posId,
    };
  });

  return clearedLemmatizedSentence;
};

export const lemmatizeProvider = {
  lemmatize,
};
