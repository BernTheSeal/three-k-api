import z from "zod";
import { ZodEffects } from "zod/v3";

type StringOptions = {
  min?: number;
  max?: number;
  emptyToNull?: boolean;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
};

export function stringSchema(
  target: string,
  options: StringOptions & { emptyToNull: true },
): z.ZodPipe<z.ZodString, z.ZodTransform<string | null, string>>;

export function stringSchema(
  target: string,
  options?: StringOptions,
): z.ZodString;
export function stringSchema(target: string, options?: StringOptions) {
  let schema = z.string(`${target} must be a string!`).trim();

  if (options?.min !== undefined)
    schema = schema.min(
      options.min,
      `${target} must be at least ${options.min} characters!`,
    );
  if (options?.max !== undefined)
    schema = schema.max(
      options.max,
      `${target} must be at most ${options.max} characters!`,
    );

  if (options?.requireUppercase) {
    schema = schema.regex(
      /[A-Z]/,
      `${target} must contain at least one uppercase letter`,
    );
  }

  if (options?.requireLowercase) {
    schema = schema.regex(
      /[a-z]/,
      `${target} must contain at least one lowercase letter`,
    );
  }

  if (options?.requireNumber) {
    schema = schema.regex(
      /[0-9]/,
      `${target} must contain at least one one number`,
    );
  }

  if (options?.emptyToNull) {
    return schema.transform((val) => (val.trim() === "" ? null : val.trim()));
  }

  return schema;
}
