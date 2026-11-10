import z from "zod";

type NumberOptions = {
  min?: number;
  max?: number;
  int?: boolean;
  positive?: boolean;
  fromString?: boolean;
};

export const numberSchema = (target: string, options?: NumberOptions) => {
  let num = z.number(`${target} must be a number!`);

  if (options?.int) {
    num = num.int(`${target} must be an integer!`);
  }

  if (options?.positive) num = num.positive(`${target} must be a positive number!`);

  if (options?.min !== undefined) num = num.min(options.min, `${target} must be at least ${options.min}!`);

  if (options?.max !== undefined) num = num.max(options.max, `${target} must be at most ${options.max}!`);

  return options?.fromString
    ? z.preprocess(
        (v) => ((typeof v == "string" && v.trim() == "") || v === null ? undefined : v),
        z.coerce.number(`${target} must be a number!`).pipe(num),
      )
    : num;
};
