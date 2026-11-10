import z from "zod";

export const enumSchema = <const T extends string>(target: string, values: readonly [T, ...T[]]) => {
  return z
    .string()
    .trim()
    .pipe(z.enum(values, `${target} must be one of: ${values.join(", ")}!`));
};
