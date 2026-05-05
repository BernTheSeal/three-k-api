import crypto from "crypto";

const generateRawToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateFamilyId = () => {
  return crypto.randomUUID();
};

const calcExpiresAt = (day: number) => {
  return new Date(Date.now() + day * 24 * 60 * 60 * 1000);
};

export { generateRawToken, hashToken, generateFamilyId, calcExpiresAt };
