import z from "zod";

type booleanOptions = {
  fromString?: boolean;
};

export const booleanSchema = (target: string, options?: booleanOptions) => {
  const bool = z.boolean(`${target} must be a boolean!`);

  return options?.fromString ? z.preprocess((v) => (v === "true" ? true : v === "false" ? false : v), bool) : bool;
};
