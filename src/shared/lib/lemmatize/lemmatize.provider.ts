import { InternalServerError } from "@/shared/errors";
import { nlp } from "./lemmatize.client";

const lemmatize = (text: string): string[] => {
  try {
    const doc = nlp.readDoc(text);
    return doc.tokens().out(nlp.its.lemma as any) as string[];
  } catch (error) {
    throw new InternalServerError({
      message: "Failed to lemmatize text",
      code: "LEMMATIZE",
    });
  }
};

export const lemmatizeProvider = {
  lemmatize,
};
