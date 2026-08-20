import { Profile } from "passport-google-oauth20";
import { AuthAccountEntity, RefreshTokenEntity } from "@/shared/types/entities";
import {
  AuthTokensShape,
  RegistrationCredentialShape,
  UserAuthInfoShape,
  PasswordChangeShape,
} from "@/shared/types/shapes/auth.shape";

type RegisterInput = RegistrationCredentialShape;
type RegisterOutput = Promise<AuthTokensShape & UserAuthInfoShape>;
export type Register = (input: RegisterInput) => RegisterOutput;

type LoginInput = Omit<RegistrationCredentialShape, "username">;
type LoginOutput = Promise<AuthTokensShape & UserAuthInfoShape>;
export type Login = (input: LoginInput) => LoginOutput;

type LoginGoogleInput = { userGoogle: Profile };
type LoginGoogleOutput = Promise<AuthTokensShape & UserAuthInfoShape>;
export type LoginGoogle = (input: LoginGoogleInput) => LoginGoogleOutput;

type RefreshInput = { cookie?: string };
type RefreshOutput = Promise<AuthTokensShape>;
export type Refresh = (input: RefreshInput) => RefreshOutput;

type LogoutInput = { cookie?: string };
type LogoutOutput = Promise<{ isAlreadyLoggedOut: boolean }>;
export type Logout = (input: LogoutInput) => LogoutOutput;

type RequestEmailVerificationInput = Pick<AuthAccountEntity, "authAccountId">;
export type RequestEmailVerification = (input: RequestEmailVerificationInput) => Promise<void>;

type VerifyEmailInput = { token: string };
export type VerifyEmail = (input: VerifyEmailInput) => Promise<void>;

type ChangePasswordInput = Pick<AuthAccountEntity, "authAccountId"> & Pick<RefreshTokenEntity, "familyId"> & PasswordChangeShape;
export type ChangePassword = (input: ChangePasswordInput) => Promise<void>;

type ForgotPasswordInput = Pick<RegistrationCredentialShape, "email">;
export type ForgotPassword = (input: ForgotPasswordInput) => Promise<void>;

type ResetPasswordInput = { token: string } & Omit<PasswordChangeShape, "currentPassword">;
export type ResetPassword = (input: ResetPasswordInput) => Promise<void>;
