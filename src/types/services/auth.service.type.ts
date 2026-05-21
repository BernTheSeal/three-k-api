import { AuthAccount } from "../entities";
import { User } from "../entities/user";
import { Profile } from "passport-google-oauth20";

export type AuthService = {
  register: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: Pick<User, "username" | "is_active"> &
      Omit<
        AuthAccount,
        "auth_account_id" | "password_hash" | "created_at" | "updated_at"
      >;
  }>;

  login: (data: { email: string; password: string }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "created_at" | "updated_at"> &
      Pick<
        AuthAccount,
        "provider" | "email" | "is_verified" | "provider_account_id"
      >;
  }>;

  loginGoogle: (data: { userGoogle: Profile }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "created_at" | "updated_at"> &
      Pick<
        AuthAccount,
        "provider" | "provider_account_id" | "email" | "is_verified"
      >;
  }>;

  refresh: (data: {
    cookieRt?: string;
  }) => Promise<{ accessToken: string; refreshToken: string }>;

  logout: (data: {
    cookieRt?: string;
  }) => Promise<{ isAlreadyLoggedOut: boolean }>;

  requestEmailVerification: (
    data: Pick<User, "user_id">,
  ) => Promise<{ expires_in: number }>;

  verifyEmail: (data: { code: string; user_id: number }) => Promise<void>;

  changePassword: (
    data: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    } & Pick<User, "user_id">,
  ) => Promise<void>;
};
