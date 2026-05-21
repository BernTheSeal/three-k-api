export type RefreshToken = {
  token_hash: string;
  user_id: number;
  family_id: string;
  is_revoked: boolean;
  revoked_reason:
    | "refresh"
    | "logout"
    | "suspect"
    | "expired"
    | "password_change"
    | null;
  revoked_at: Date;
  expires_at: Date;
  created_at: Date;
};
