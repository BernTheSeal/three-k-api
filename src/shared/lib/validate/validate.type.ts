import z from "zod";

export type GetInfer<S extends z.ZodType> = z.output<S>;
