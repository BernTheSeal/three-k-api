import { numberSchema, stringSchema } from "./builders";

export const offsetSchema = numberSchema("offset", {
  fromString: true,
  min: 0,
  int: true,
});
export const searchSchema = stringSchema("search", { min: 1 });
