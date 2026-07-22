import crypto from "crypto";

export const generateRandomHex = (bytes: number): string => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const sha256 = (value: string): string => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export const generateUUID = (): string => {
  return crypto.randomUUID();
};

export const generateRandomNumericCode = (min: number, max: number): string => {
  return crypto.randomInt(min, max).toString();
};
