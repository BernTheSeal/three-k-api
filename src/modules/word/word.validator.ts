import z from "zod";
import { enumArraySchema, stringArraySchema, stringSchema } from "@/shared/lib/validate/builders";
import { offsetSchema, searchSchema } from "../../shared/lib/validate/common";

export const listWordSchema = z.object({
  query: z
    .object({
      offset: offsetSchema,
      search: searchSchema,
      pos: stringArraySchema("pos", { fromUrl: true }),
      level: enumArraySchema("level", ["a1", "a2", "b1", "b2", "c1", "c2"], { fromUrl: true }),
    })
    .partial(),
});

export const getWordByIdSchema = z.object({
  params: z.object({
    word: stringSchema("word", { min: 1, max: 255, toLowerCase: true }),
  }),
});

export type ListWordDto = z.infer<typeof listWordSchema>;
export type GetWordByIdDto = z.infer<typeof getWordByIdSchema>;
