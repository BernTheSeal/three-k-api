import { clearRefreshCookie, setRefreshCookie } from "../utils/cookie";
import { authService } from "../services/auth.service";
import { sendSuccessResponse } from "../utils/response";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthController } from "../types/controllers/auth.controller.type";
import { Profile } from "passport-google-oauth20";

export const authController: AuthController = {
  async me(_req, res, next) {
    const { user_id, family_id, auth_account_id } = res.locals.user;

    sendSuccessResponse(res, HTTP_STATUS.success.OK, "User is logged in!", {
      userId: user_id,
      familyId: family_id,
      authAccountId: auth_account_id,
    });

    return;
  },

  async register(_req, res) {
    const { username, email, password } = res.locals.validated_data.body;

    const { accessToken, refreshToken, user } = await authService.register({
      email,
      username,
      password,
    });

    setRefreshCookie(res, refreshToken, 14);

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.CREATED,
      "user successfully created!",
      {
        accessToken,
        user: {
          id: user.user_id,
          email: user.email,
          username: user.username,
          provider: user.provider,
          providerAccountId: user.provider_account_id,
          isVerified: user.is_verified,
          isActive: user.is_active,
        },
      },
    );

    return;
  },

  async login(_req, res) {
    const { email, password } = res.locals.validated_data.body;

    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

    setRefreshCookie(res, refreshToken, 14);

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "user successfully login!",
      {
        accessToken,
        user: {
          id: user.user_id,
          username: user.username,
          isActive: user.is_active,
          email: user.email,
          provdier: user.provider,
          isVerified: user.is_verified,
          providerAccountId: user.provider_account_id,
        },
      },
    );

    return;
  },

  async refresh(req, res) {
    const cookieRt = req.cookies.refreshToken;

    const { accessToken, rawRefreshToken } = await authService.refresh({
      cookieRt,
    });

    setRefreshCookie(res, rawRefreshToken, 14);

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "New access token is successfully created!",
      { accessToken },
    );

    return;
  },

  async logout(req, res) {
    const cookieRt = req.cookies.refreshToken;

    const { isAlreadyLoggedOut } = await authService.logout({ cookieRt });

    clearRefreshCookie(res);

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      isAlreadyLoggedOut
        ? "User already logged out!"
        : "User successfully logged out!",
    );
  },

  async googleCallback(req, res) {
    const userGoogle = req.user as Profile;

    const { user, accessToken, refreshToken } = await authService.loginGoogle({
      userGoogle,
    });

    setRefreshCookie(res, refreshToken, 14);

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.CREATED,
      "User successfully login with Google account!",
      { accessToken, user },
    );
  },

  async requestEmailVerification(req, res) {
    const { auth_account_id } = res.locals.user;

    await authService.requestEmailVerification({
      auth_account_id,
    });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "Verification code has been sent to your email address.",
    );

    return;
  },

  async verifyEmail(req, res) {
    const { token } = res.locals.validated_data.body;

    await authService.verifyEmail({ token });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      " Your account is successfully verified!",
    );
  },

  async changePassword(req, res) {
    const { auth_account_id, family_id } = res.locals.user;
    const { currentPassword, newPassword, newPasswordConfirm } =
      res.locals.validated_data.body;

    await authService.changePassword({
      currentPassword,
      newPassword,
      newPasswordConfirm,
      auth_account_id,
      family_id,
    });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "Password changed successfully!",
    );
  },

  async forgotPassword(req, res) {
    const { email } = res.locals.validated_data.body;

    await authService.forgotPassword({ email });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "If this email is registered, you will receive a reset link.",
    );
  },

  async resetPassword(req, res) {
    const { token, newPassword, newPasswordConfirm } =
      res.locals.validated_data.body;

    await authService.resetPassword({ token, newPassword, newPasswordConfirm });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "Password reset successfully.",
    );
  },
};
