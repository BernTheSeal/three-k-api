import z from "zod";

export function stringArraySchema(
  target: string,
  options: { fromUrl: true },
): z.ZodPipe<
  z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>,
  z.ZodTransform<string[], string | string[]>
>;

export function stringArraySchema(
  target: string,
  options?: { fromUrl?: false },
): z.ZodArray<z.ZodString>;

export function stringArraySchema(
  target: string,
  options?: { fromUrl?: boolean },
) {
  const elementMsg = `Each ${target} element must be a string!`;
  const arrayMsg = `${target} must be an array of strings!`;
  const unionMsg = `${target} must be an array or a string!`;

  if (options?.fromUrl) {
    return z
      .union(
        [z.string(elementMsg), z.array(z.string(elementMsg), arrayMsg)],
        unionMsg,
      )
      .transform((val) => (Array.isArray(val) ? val : [val]));
  }
  return z.array(z.string(elementMsg), arrayMsg);
}
