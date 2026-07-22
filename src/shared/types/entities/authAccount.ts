export type LocalAuthAccount = {
  auth_account_id: number;
  user_id: number;
  provider: "local";
  provider_account_id: string;
  email: string;
  password_hash: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
};

type GoogleAuthAccount = {
  auth_account_id: number;
  user_id: number;
  provider: "google";
  provider_account_id: string;
  email: string;
  password_hash: null;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
};

export type AuthAccount = LocalAuthAccount | GoogleAuthAccount;
