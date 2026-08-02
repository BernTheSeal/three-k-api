import { AuthAccountEntity } from "../../types/entities";
import { UserEntity } from "../../types/entities";
import { Profile } from "passport-google-oauth20";

export type AuthService = {
  register: (data: { username: string; email: string; password: string }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
    authAccount: Omit<AuthAccountEntity, "passwordHash" | "userId">;
  }>;

  login: (data: { email: string; password: string }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
    authAccount: Omit<AuthAccountEntity, "passwordHash" | "userId">;
  }>;

  loginGoogle: (data: { userGoogle: Profile }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserEntity;
    authAccount: Omit<AuthAccountEntity, "passwordHash" | "userId">;
  }>;

  refresh: (data: { cookieRt?: string }) => Promise<{ accessToken: string; rawRefreshToken: string }>;

  logout: (data: { cookieRt?: string }) => Promise<{ isAlreadyLoggedOut: boolean }>;

  requestEmailVerification: (data: Pick<AuthAccountEntity, "authAccountId">) => Promise<void>;

  verifyEmail: (data: { token: string }) => Promise<void>;

  changePassword: (data: {
    authAccountId: number;
    familyId: string;
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) => Promise<void>;

  forgotPassword: (data: { email: string }) => Promise<void>;

  resetPassword: (data: { token: string; newPassword: string; newPasswordConfirm: string }) => Promise<void>;
};
