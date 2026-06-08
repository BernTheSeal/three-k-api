export class RefreshTokenError extends Error {
  reason: "suspect" | "expired";
  family_id: string;

  constructor(family_id: string, reason: "suspect" | "expired") {
    super(`Refresh token error due to ${reason}`);
    this.reason = reason;
    this.family_id = family_id;
  }
}
