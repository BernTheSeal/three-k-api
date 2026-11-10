import { stringSchema, objectSchema, GetInfer } from "@/shared/lib/validate";

export const createSchema = objectSchema("create", {
  body: objectSchema("body", {
    sentence: stringSchema("sentence", { min: 1, max: 250 }),
  }),
});

export type CreateDto = GetInfer<typeof createSchema>;
