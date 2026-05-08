export type User = {
  user_id: number;
  email: string;
  username: string;
  password_hash: string;
  google_id: string | null;
  photo_url: string | null;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
};
