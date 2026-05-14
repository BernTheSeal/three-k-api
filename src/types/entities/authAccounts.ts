export type AuthAccount = {
  auth_account_id: number;
  user_id: number;
  provider: "local" | "google";
  provider_account_id: string;
  email: string;
  password_hash: string | null;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
};
