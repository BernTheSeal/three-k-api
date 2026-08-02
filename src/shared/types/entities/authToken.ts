export type AuthTokenEntity = {
  authTokenId: number;
  authAccountId: number;
  tokenHash: string;
  tokenType: "verification_email" | "password_reset";
  expiresAt: Date;
  usedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
};
