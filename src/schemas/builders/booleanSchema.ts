import z from "zod";

type booleanOptions = {
  fromString?: boolean;
};

export const booleanSchema = (target: string, options?: booleanOptions) => {
  let schema = options?.fromString
    ? z
        .enum(["true", "false"], `${target} must be a boolean!`)
        .transform((val) => val === "true")
    : z.boolean(`${target} must be a boolean!`);

  return schema;
};
