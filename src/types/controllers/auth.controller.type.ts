import { RequestHandler } from "express";

import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../../schemas/validators/auth.validator";
import { AuthHandler, PublicHandler } from "./common.controller.type";

export type AuthController = {
  me: AuthHandler;
  register: PublicHandler<RegisterDto>;
  login: PublicHandler<LoginDto>;
  refresh: PublicHandler;
  logout: PublicHandler;
  googleCallback: PublicHandler;
  requestEmailVerification: AuthHandler;
  verifyEmail: PublicHandler<VerifyEmailDto>;
  changePassword: AuthHandler<ChangePasswordDto>;
  forgotPassword: PublicHandler<ForgotPasswordDto>;
  resetPassword: PublicHandler<ResetPasswordDto>;
};
