import z from "zod";

type NumberOptions = {
  min?: number;
  max?: number;
  int?: boolean;
  positive?: boolean;
  fromString?: boolean;
};

export const numberSchema = (target: string, options?: NumberOptions) => {
  let schema = options?.fromString
    ? z.coerce.number(`${target} must be a number!`)
    : z.number(`${target} must be a number!`);

  if (options?.int) {
    schema = schema.int(`${target} must be an integer!`);
  }
  if (options?.positive)
    schema = schema.positive(`${target} must be a positive number!`);
  if (options?.min !== undefined)
    schema = schema.min(
      options.min,
      `${target} must be at least ${options.min}!`,
    );
  if (options?.max !== undefined)
    schema = schema.max(
      options.max,
      `${target} must be at most ${options.max}!`,
    );

  return schema;
};
