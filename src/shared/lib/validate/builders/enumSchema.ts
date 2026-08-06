import z from "zod";

export const enumSchema = <T extends string>(target: string, values: [T, ...T[]]) => {
  return z
    .string()
    .trim()
    .pipe(z.enum(values, `${target} must be one of: ${values.join(", ")}!`));
};
