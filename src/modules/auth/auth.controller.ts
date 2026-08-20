import { Profile } from "passport-google-oauth20";
import { authService } from "./auth.service";
import { sendSuccessResponse } from "@/shared/helpers/response.helper";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "./auth.helper";

import {
  Me,
  Register,
  Login,
  Refresh,
  Logout,
  GoogleCallback,
  RequestEmailVerification,
  VerifyEmail,
  ChangePassword,
  ForgotPassword,
  ResetPassword,
} from "./auth.dto";

const me: Me = async (_req, res, next) => {
  const { userId, familyId, authAccountId } = res.locals.user;

  sendSuccessResponse(res, HTTP_STATUS.OK, "User is logged in!", {
    userId,
    familyId,
    authAccountId,
  });

  return;
};

const register: Register = async (_req, res) => {
  const { username, email, password } = res.locals.validatedData.body;

  const { accessToken, refreshToken, user, authAccount } = await authService.register({
    email,
    username,
    password,
  });

  setRefreshTokenCookie(res, refreshToken);

  sendSuccessResponse(res, HTTP_STATUS.CREATED, "user successfully created!", {
    accessToken,
    user,
    authAccount,
  });

  return;
};

const login: Login = async (_req, res) => {
  const { email, password } = res.locals.validatedData.body;

  const { user, authAccount, accessToken, refreshToken } = await authService.login({
    email,
    password,
  });

  setRefreshTokenCookie(res, refreshToken);

  sendSuccessResponse(res, HTTP_STATUS.OK, "user successfully login!", {
    accessToken,
    user,
    authAccount,
  });

  return;
};

const refresh: Refresh = async (req, res) => {
  const cookie = req.cookies.refreshToken;

  const { accessToken, refreshToken } = await authService.refresh({
    cookie,
  });

  setRefreshTokenCookie(res, refreshToken);

  sendSuccessResponse(res, HTTP_STATUS.OK, "New access token is successfully created!", { accessToken });

  return;
};

const logout: Logout = async (req, res) => {
  const cookie = req.cookies.refreshToken;

  const { isAlreadyLoggedOut } = await authService.logout({ cookie });

  clearRefreshTokenCookie(res);

  sendSuccessResponse(res, HTTP_STATUS.OK, isAlreadyLoggedOut ? "User already logged out!" : "User successfully logged out!");
};

const googleCallback: GoogleCallback = async (req, res) => {
  const userGoogle = req.user as Profile;

  const { user, authAccount, accessToken, refreshToken } = await authService.loginGoogle({
    userGoogle,
  });

  setRefreshTokenCookie(res, refreshToken);

  sendSuccessResponse(res, HTTP_STATUS.OK, "user successfully login!", {
    accessToken,
    user,
    authAccount,
  });
};

const requestEmailVerification: RequestEmailVerification = async (req, res) => {
  const { authAccountId } = res.locals.user;

  await authService.requestEmailVerification({
    authAccountId,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, "Verification code has been sent to your email address.");

  return;
};

const verifyEmail: VerifyEmail = async (req, res) => {
  const { token } = res.locals.validatedData.body;

  await authService.verifyEmail({ token });

  sendSuccessResponse(res, HTTP_STATUS.OK, " Your account is successfully verified!");
};

const changePassword: ChangePassword = async (req, res) => {
  const { authAccountId, familyId } = res.locals.user;
  const { currentPassword, newPassword, newPasswordConfirm } = res.locals.validatedData.body;

  await authService.changePassword({
    currentPassword,
    newPassword,
    newPasswordConfirm,
    authAccountId,
    familyId,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, "Password changed successfully!");
};

const forgotPassword: ForgotPassword = async (req, res) => {
  const { email } = res.locals.validatedData.body;

  await authService.forgotPassword({ email });

  sendSuccessResponse(res, HTTP_STATUS.OK, "If this email is registered, you will receive a reset link.");
};

const resetPassword: ResetPassword = async (req, res) => {
  const { token, newPassword, newPasswordConfirm } = res.locals.validatedData.body;

  await authService.resetPassword({ token, newPassword, newPasswordConfirm });

  sendSuccessResponse(res, HTTP_STATUS.OK, "Password reset successfully.");
};

export const authController = {
  me,
  register,
  login,
  refresh,
  logout,
  googleCallback,
  requestEmailVerification,
  verifyEmail,
  changePassword,
  forgotPassword,
  resetPassword,
};
