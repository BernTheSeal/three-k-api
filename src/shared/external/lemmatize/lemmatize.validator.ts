import { z } from "zod";
import { EXPECTED_POS_FROM_NLP } from "./lemmatize.map";
import { enumSchema } from "@/shared/lib/validate/builders";

export const lemmatizeResponseSchema = z.array(
  z.object({
    lemma: z.string(),
    pos: enumSchema("pos", EXPECTED_POS_FROM_NLP),
    surfaceForm: z.string(),
    isOov: z.boolean(),
  }),
);
