import { z } from "zod";
import { POS_TAG_MAP } from "./lemmatize.map";
import { enumSchema } from "@/shared/lib/validate/builders";

const posTagArray = Object.keys(POS_TAG_MAP) as [keyof typeof POS_TAG_MAP, ...(keyof typeof POS_TAG_MAP)[]];

export const lemmatizeResponseSchema = z.array(
  z.object({
    lemma: z.string(),
    pos: enumSchema("pos", posTagArray),
    text: z.string(),
  }),
);
