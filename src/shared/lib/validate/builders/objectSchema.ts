import z, { ZodRawShape } from "zod";

export const objectSchema = <T extends ZodRawShape>(target: string, schemas: T) => {
  return z.object(schemas, `${target} must be an object!`);
};
