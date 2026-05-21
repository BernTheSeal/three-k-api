import { RequestHandler } from "express";
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ChangePasswordDto,
} from "../schemas/validators/auth.validator";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookie";
import { authService } from "../services/auth.service";
import { sendSuccessResponse } from "../utils/response";
import { HTTP_STATUS } from "../constants/httpStatus";

import { Profile } from "passport-google-oauth20";

type AuthController = {
  me: RequestHandler<{}, any, {}, {}, { userId: number }>;
  register: RequestHandler<{}, any, {}, {}, { reqData: RegisterDto }>;
  login: RequestHandler<{}, any, {}, {}, { reqData: LoginDto }>;
  refresh: RequestHandler;
  logout: RequestHandler;
  googleCallback: RequestHandler;
  requestEmailVerification: RequestHandler<{}, any, {}, {}, { userId: number }>;
  verifyEmail: RequestHandler<
    {},
    any,
    {},
    {},
    { reqData: VerifyEmailDto; userId: number }
  >;
  changePassword: RequestHandler<
    {},
    any,
    {},
    {},
    { reqData: ChangePasswordDto; userId: number }
  >;
};

export const authController: AuthController = {
  async me(_req, res, next) {
    const userId = res.locals.userId;

    sendSuccessResponse(res, HTTP_STATUS.success.OK, "User is logged in!", {
      userId,
    });

    return;
  },

  async register(_req, res) {
    const { username, email, password } = res.locals.reqData.body;

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
    const { email, password } = res.locals.reqData.body;

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

    const { accessToken, refreshToken } = await authService.refresh({
      cookieRt,
    });

    setRefreshCookie(res, refreshToken, 14);

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
    const userId = res.locals.userId;

    const { expires_in } = await authService.requestEmailVerification({
      user_id: userId,
    });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "Verification code has been sent to your email address.",
      { expiresIn: expires_in },
    );

    return;
  },

  async verifyEmail(req, res) {
    const userId = res.locals.userId;
    const { code } = res.locals.reqData.body;

    await authService.verifyEmail({ code, user_id: userId });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      " Your account is successfully verified!",
    );
  },

  async changePassword(req, res) {
    const userId = res.locals.userId;
    const { currentPassword, newPassword, newPasswordConfirm } =
      res.locals.reqData.body;

    await authService.changePassword({
      currentPassword,
      newPassword,
      newPasswordConfirm,
      user_id: userId,
    });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "Password changed successfully!",
    );
  },
};
