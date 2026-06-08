import { AuthAccount, RefreshToken } from "../entities";
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
  }) => Promise<{ accessToken: string; rawRefreshToken: string }>;

  logout: (data: {
    cookieRt?: string;
  }) => Promise<{ isAlreadyLoggedOut: boolean }>;

  requestEmailVerification: (
    data: Pick<AuthAccount, "auth_account_id">,
  ) => Promise<void>;

  verifyEmail: (data: { token: string }) => Promise<void>;

  changePassword: (data: {
    auth_account_id: number;
    family_id: string;
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => Promise<void>;

  forgotPassword: (data: { email: string }) => Promise<void>;

  resetPassword: (data: {
    token: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => Promise<void>;
};
