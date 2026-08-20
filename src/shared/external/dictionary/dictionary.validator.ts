import z from "zod";

const senseSchema = z.object({
  definition: z.string(),
  examples: z.array(z.string()).default([]),
});

const entrySchema = z.object({
  partOfSpeech: z.string(),
  senses: z.array(senseSchema),
});

export const fetchSensesSchema = z.object({
  entries: z.array(entrySchema),
});
