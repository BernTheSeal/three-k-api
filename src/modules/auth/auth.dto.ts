import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@/modules/auth/auth.validator";

import { AuthHandler, PublicHandler } from "@/shared/types/requestHandler";

export type Me = AuthHandler;
export type Register = PublicHandler<RegisterDto>;
export type Login = PublicHandler<LoginDto>;
export type Refresh = PublicHandler;
export type Logout = PublicHandler;
export type GoogleCallback = PublicHandler;
export type RequestEmailVerification = AuthHandler;
export type VerifyEmail = PublicHandler<VerifyEmailDto>;
export type ChangePassword = AuthHandler<ChangePasswordDto>;
export type ForgotPassword = PublicHandler<ForgotPasswordDto>;
export type ResetPassword = PublicHandler<ResetPasswordDto>;
