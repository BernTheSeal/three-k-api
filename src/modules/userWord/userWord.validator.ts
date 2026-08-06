import { booleanSchema, enumSchema, numberSchema, stringSchema } from "@/shared/lib/validate/builders";
import z from "zod";

export const createSchema = z.object({
  body: z.object({
    wordId: numberSchema("wordId", { min: 1 }),
    status: enumSchema("status", ["known", "learning"]),
    note: stringSchema("note", { emptyToNull: true }),
    isFavorite: booleanSchema("isFavorite"),
  }),
});

export const removeSchema = z.object({
  params: z.object({
    wordId: numberSchema("wordId", { fromString: true }),
  }),
});

export const updateSchema = z.object({
  body: z
    .object({
      status: enumSchema("status", ["known", "learning"]).optional(),
      note: stringSchema("note", { emptyToNull: true }).optional(),
      isFavorite: booleanSchema("isFavorite").optional(),
    })
    .refine((data) => Object.keys(data).length > 0, { error: "At least one field must be provided" }),

  params: z.object({
    wordId: numberSchema("wordId", { min: 1, fromString: true }),
  }),
});

export type CreateDto = z.infer<typeof createSchema>;
export type RemoveDto = z.infer<typeof removeSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
