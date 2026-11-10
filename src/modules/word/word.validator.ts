import { enumSchema, arraySchema, stringSchema, offsetSchema, searchSchema, objectSchema, GetInfer } from "@/shared/lib/validate";
import { POS } from "@/shared/types/entities";

export const listWordSchema = objectSchema("list word", {
  query: objectSchema("query", {
    offset: offsetSchema,
    search: searchSchema,
    pos: arraySchema("pos", enumSchema("pos elements", POS), { fromUrl: true }),
    level: arraySchema("levels", enumSchema("level ", ["a1", "a2", "b1", "b2", "c1", "c2"]), { fromUrl: true }),
  }).partial(),
});

export const getWordSchema = objectSchema("get word", {
  params: objectSchema("params", {
    word: stringSchema("word", { min: 1, max: 255, toLowerCase: true }),
  }),
});

export type ListWordDto = GetInfer<typeof listWordSchema>;
export type GetWordByIdDto = GetInfer<typeof getWordSchema>;
