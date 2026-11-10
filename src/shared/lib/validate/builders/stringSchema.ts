import z from "zod";

type StringOptions = {
  min?: number;
  max?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  toLowerCase?: boolean;
};

export const stringSchema = (target: string, options?: StringOptions) => {
  let str = z.string(`${target} must be a string!`).trim();

  if (options?.toLowerCase) {
    str = str.toLowerCase();
  }

  if (options?.min !== undefined) str = str.min(options.min, `${target} must be at least ${options.min} characters!`);

  if (options?.max !== undefined) str = str.max(options.max, `${target} must be at most ${options.max} characters!`);

  if (options?.requireUppercase) {
    str = str.regex(/[A-Z]/, `${target} must contain at least one uppercase letter`);
  }

  if (options?.requireLowercase) {
    str = str.regex(/[a-z]/, `${target} must contain at least one lowercase letter`);
  }

  if (options?.requireNumber) {
    str = str.regex(/[0-9]/, `${target} must contain at least one number`);
  }

  return str;
};
