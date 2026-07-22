import z from "zod";
import { booleanSchema, enumSchema, numberSchema, stringArraySchema, stringSchema } from "@/shared/lib/validate/builders";
import { offsetSchema, searchSchema } from "../../shared/lib/validate/common";

export const getWordsSchema = z.object({
  query: z
    .object({
      offset: offsetSchema,
      search: searchSchema,
      pos: stringArraySchema("pos", { fromUrl: true }),
      level: stringArraySchema("level", { fromUrl: true }),
      mode: enumSchema("mode", ["mine", "all"]),
      status: enumSchema("status", ["known", "learning"]),
      is_favorite: booleanSchema("isFavorite", { fromString: true }),
    })
    .partial(),
});

export const getWordByIdSchema = z.object({
  params: z.object({
    word: stringSchema("word", { min: 1, max: 255, toLowerCase: true }),
  }),
});

export type GetWordDto = z.infer<typeof getWordsSchema>;
export type GetWordByIdDto = z.infer<typeof getWordByIdSchema>;

export type GetWordInput = Omit<GetWordDto["query"], "offset">;
