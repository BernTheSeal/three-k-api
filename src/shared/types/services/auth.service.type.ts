import { AuthAccount, RefreshToken } from "../../types/entities";
import { User } from "../../types/entities";
import { Profile } from "passport-google-oauth20";

export type AuthService = {
  register: (data: { username: string; email: string; password: string }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
    authAccount: Omit<AuthAccount, "password_hash" | "user_id">;
  }>;

  login: (data: { email: string; password: string }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
    authAccount: Omit<AuthAccount, "password_hash" | "user_id">;
  }>;

  loginGoogle: (data: { userGoogle: Profile }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
    authAccount: Omit<AuthAccount, "password_hash" | "user_id">;
  }>;

  refresh: (data: { cookieRt?: string }) => Promise<{ accessToken: string; rawRefreshToken: string }>;

  logout: (data: { cookieRt?: string }) => Promise<{ isAlreadyLoggedOut: boolean }>;

  requestEmailVerification: (data: Pick<AuthAccount, "auth_account_id">) => Promise<void>;

  verifyEmail: (data: { token: string }) => Promise<void>;

  changePassword: (data: {
    auth_account_id: number;
    family_id: string;
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => Promise<void>;

  forgotPassword: (data: { email: string }) => Promise<void>;

  resetPassword: (data: { token: string; newPassword: string; newPasswordConfirm: string }) => Promise<void>;
};
