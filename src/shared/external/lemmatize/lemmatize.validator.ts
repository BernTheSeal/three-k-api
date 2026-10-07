import { z } from "zod";
import { enumSchema } from "@/shared/lib/validate/builders";
import { EXPECTED_POS_FROM_NLP } from "./lemmatize.map";

export const lemmatizeResponseSchema = z.array(
  z.object({
    lemma: z.string(),
    pos: enumSchema("pos", EXPECTED_POS_FROM_NLP),
    text: z.string(),
  }),
);
