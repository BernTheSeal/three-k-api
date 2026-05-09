import { RequestHandler } from "express";
import { RegisterDto, LoginDto } from "../schemas/validators/auth.validator";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookie";
import { authService } from "../services/auth.service";
import { sendSuccessResponse } from "../utils/response";
import { HTTP_STATUS } from "../constants/httpStatus";

import { Profile } from "passport-google-oauth20";

type AuthController = {
  me: RequestHandler<{}, any, {}, {}, { userId: number }>;
  register: RequestHandler<{}, any, {}, {}, RegisterDto>;
  login: RequestHandler<{}, any, {}, {}, LoginDto>;
  refresh: RequestHandler;
  logout: RequestHandler;
  googleCallback: RequestHandler;
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
    const { username, email, password } = res.locals.body;

    const { accessToken, refreshToken, newUser } = await authService.register({
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
          id: newUser.user_id,
          email: newUser.email,
          username: newUser.username,
          googleId: newUser.google_id,
          photoUrl: newUser.photo_url,
          isEmailVerified: newUser.is_email_verified,
          createdAt: newUser.created_at,
          updatedAt: newUser.updated_at,
        },
      },
    );

    return;
  },

  async login(_req, res) {
    const { email, password } = res.locals.body;

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
          email: user.email,
          username: user.username,
          googleId: user.google_id,
          photoUrl: user.photo_url,
          isEmailVerified: user.is_email_verified,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
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
};
