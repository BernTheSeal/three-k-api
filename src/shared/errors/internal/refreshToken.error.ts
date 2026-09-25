type RefreshTokenErrorConst = {
  familyId: string;
  reason: "suspect" | "expired";
};

export class RefreshTokenError extends Error {
  public readonly reason: "suspect" | "expired";
  public readonly familyId: string;

  constructor({ familyId, reason }: RefreshTokenErrorConst) {
    super(`Refresh token error due to ${reason}`);
    this.reason = reason;
    this.familyId = familyId;
  }
}
