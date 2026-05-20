export type VerificationToken = {
  verification_token_id: number;
  auth_account_id: number;
  is_active: boolean;
  token_hash: string;
  token_type: "verification_email" | "password_reset";
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
};
