import { ZodRawShape, ZodType } from "zod";
import z from "zod";

type arrayOptions = {
  fromUrl?: boolean;
  min?: number;
};

export function arraySchema<T extends ZodType>(target: string, schema: T, options?: arrayOptions) {
  let arr = z.array(schema, `${target} must be an array`);

  if (options?.min !== undefined) {
    arr = arr.min(options.min, `${target} must have at least ${options.min} item(s)!`);
  }

  if (options?.fromUrl) {
    return z.preprocess((v) => (v === undefined || Array.isArray(v) ? v : [v]), arr);
  }

  return arr;
}
