import { AuthAccountEntity, UserEntity } from "@/shared/types/entities";
import { Profile } from "passport-google-oauth20";

export type Register = (input: { username: string; email: string; password: string }) => Promise<{
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
  authAccount: Omit<AuthAccountEntity, "passwordHash" | "userId">;
}>;

export type Login = (input: { email: string; password: string }) => Promise<{
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
  authAccount: Omit<AuthAccountEntity, "passwordHash" | "userId">;
}>;

export type LoginGoogle = (input: { userGoogle: Profile }) => Promise<{
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
  authAccount: Omit<AuthAccountEntity, "passwordHash" | "userId">;
}>;

export type Refresh = (input: { cookieRt?: string }) => Promise<{ accessToken: string; rawRefreshToken: string }>;

export type Logout = (input: { cookieRt?: string }) => Promise<{ isAlreadyLoggedOut: boolean }>;

export type RequestEmailVerification = (input: Pick<AuthAccountEntity, "authAccountId">) => Promise<void>;

export type VerifyEmail = (input: { token: string }) => Promise<void>;

export type ChangePassword = (input: {
  authAccountId: number;
  familyId: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}) => Promise<void>;

export type ForgotPassword = (input: { email: string }) => Promise<void>;

export type ResetPassword = (input: { token: string; newPassword: string; newPasswordConfirm: string }) => Promise<void>;
