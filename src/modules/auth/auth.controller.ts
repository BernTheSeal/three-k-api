import { Profile } from "passport-google-oauth20";
import { authService } from "./auth.service";
import { sendSuccessResponse } from "@/shared/helpers/response.helper";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { AuthController } from "@/shared/types/controllers/auth.controller.type";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "./auth.helper";

export const authController: AuthController = {
  async me(_req, res, next) {
    const { userId, familyId, authAccountId } = res.locals.user;

    sendSuccessResponse(res, HTTP_STATUS.OK, "User is logged in!", {
      userId,
      familyId,
      authAccountId,
    });

    return;
  },

  async register(_req, res) {
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
  },

  async login(_req, res) {
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
  },

  async refresh(req, res) {
    const cookieRt = req.cookies.refreshToken;

    const { accessToken, rawRefreshToken } = await authService.refresh({
      cookieRt,
    });

    setRefreshTokenCookie(res, rawRefreshToken);

    sendSuccessResponse(res, HTTP_STATUS.OK, "New access token is successfully created!", { accessToken });

    return;
  },

  async logout(req, res) {
    const cookieRt = req.cookies.refreshToken;

    const { isAlreadyLoggedOut } = await authService.logout({ cookieRt });

    clearRefreshTokenCookie(res);

    sendSuccessResponse(res, HTTP_STATUS.OK, isAlreadyLoggedOut ? "User already logged out!" : "User successfully logged out!");
  },

  async googleCallback(req, res) {
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
  },

  async requestEmailVerification(req, res) {
    const { authAccountId } = res.locals.user;

    await authService.requestEmailVerification({
      authAccountId,
    });

    sendSuccessResponse(res, HTTP_STATUS.OK, "Verification code has been sent to your email address.");

    return;
  },

  async verifyEmail(req, res) {
    const { token } = res.locals.validatedData.body;

    await authService.verifyEmail({ token });

    sendSuccessResponse(res, HTTP_STATUS.OK, " Your account is successfully verified!");
  },

  async changePassword(req, res) {
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
  },

  async forgotPassword(req, res) {
    const { email } = res.locals.validatedData.body;

    await authService.forgotPassword({ email });

    sendSuccessResponse(res, HTTP_STATUS.OK, "If this email is registered, you will receive a reset link.");
  },

  async resetPassword(req, res) {
    const { token, newPassword, newPasswordConfirm } = res.locals.validatedData.body;

    await authService.resetPassword({ token, newPassword, newPasswordConfirm });

    sendSuccessResponse(res, HTTP_STATUS.OK, "Password reset successfully.");
  },
};
