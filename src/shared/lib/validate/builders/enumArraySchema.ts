import z from "zod";

export function enumArraySchema<T extends string>(target: string, values: [T, ...T[]], options?: { fromUrl?: boolean }) {
  const elementMsg = `${target} must be one of: ${values.join(", ")}!`;
  const arrayMsg = `${target} must be an array!`;

  const base = z.enum(values, elementMsg);

  if (options?.fromUrl) {
    const unionMsg = `${target} must be an array or one of: ${values.join(", ")}`;

    return z.union([base, z.array(base, arrayMsg)], unionMsg).transform((val) => (Array.isArray(val) ? val : [val]));
  }

  return z.array(base, arrayMsg);
}
