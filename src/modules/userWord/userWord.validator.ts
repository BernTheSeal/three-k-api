import { booleanSchema, enumSchema, numberSchema, GetInfer, objectSchema, stringSchema } from "@/shared/lib/validate";

export const createSchema = objectSchema("create", {
  body: objectSchema("body", {
    wordId: numberSchema("wordId", { min: 1 }),
    status: enumSchema("status", ["known", "learning"]),
    note: stringSchema("note").nullable(),
    isFavorite: booleanSchema("isFavorite"),
  }),
});

export const removeSchema = objectSchema("remove", {
  params: objectSchema("params", {
    wordId: numberSchema("wordId", { fromString: true }),
  }),
});

export const updateSchema = objectSchema("update", {
  body: objectSchema("body", {
    status: enumSchema("status", ["known", "learning"]).optional(),
    note: stringSchema("note").nullable().optional(),
    isFavorite: booleanSchema("isFavorite").optional(),
  }),
  params: objectSchema("params", {
    wordId: numberSchema("wordId", { min: 1, fromString: true }),
  }),
});

export type CreateDto = GetInfer<typeof createSchema>;
export type RemoveDto = GetInfer<typeof removeSchema>;
export type UpdateDto = GetInfer<typeof updateSchema>;
