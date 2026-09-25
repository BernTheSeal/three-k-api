import { stringSchema } from "@/shared/lib/validate/builders";
import z from "zod";

export const createSchema = z.object({
  body: z.object({
    sentence: stringSchema("sentence", { min: 1, max: 250 }),
  }),
});

export type CreateDto = z.infer<typeof createSchema>;
