export type RefreshTokenEntity = {
  tokenHash: string;
  authAccountId: number;
  familyId: string;
  isRevoked: boolean;
  revokedReason: "refresh" | "logout" | "suspect" | "expired" | "password_change" | null;
  revokedAt: Date;
  expiresAt: Date;
  createdAt: Date;
};
