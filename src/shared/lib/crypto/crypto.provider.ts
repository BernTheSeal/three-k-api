import crypto from "crypto";

const generateRandomHex = (bytes: number): string => {
  return crypto.randomBytes(bytes).toString("hex");
};

const sha256 = (value: string): string => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

const generateUUID = (): string => {
  return crypto.randomUUID();
};

const generateRandomNumericCode = (min: number, max: number): string => {
  return crypto.randomInt(min, max).toString();
};

export const cryptoProvider = {
  generateRandomHex,
  sha256,
  generateUUID,
  generateRandomNumericCode,
};
