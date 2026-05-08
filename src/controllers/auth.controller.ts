import { RequestHandler } from "express";
import { RegisterDto, LoginDto } from "../schemas/validators/auth.validator";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookie";
import { authService } from "../services/auth.service";

type AuthController = {
  me: RequestHandler<{}, any, {}, {}, { userId: number }>;
  register: RequestHandler<{}, any, {}, {}, RegisterDto>;
  login: RequestHandler<{}, any, {}, {}, LoginDto>;
  refresh: RequestHandler<{}, any, {}, {}, {}>;
  logout: RequestHandler<{}, any, {}, {}, {}>;
};

export const authController: AuthController = {
  async me(req, res, next) {
    const userId = res.locals.userId;
    return res.status(200).json({
      success: true,
      message: "you are logged in!",
      yourId: userId,
    });
  },

  async register(_req, res) {
    const { username, email, password } = res.locals.body;

    const { accessToken, refreshToken, newUser } = await authService.register({
      email,
      username,
      password,
    });

    setRefreshCookie(res, refreshToken, 14);

    return res.status(201).json({
      success: true,
      message: "user successfully created!",
      data: {
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
    });
  },

  async login(_req, res) {
    const { email, password } = res.locals.body;

    const { user, accessToken, refreshToken } = await authService.login({
      email,
      password,
    });

    setRefreshCookie(res, refreshToken, 14);

    return res.status(200).json({
      success: true,
      message: "user successfully login!",
      data: {
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
    });
  },

  async refresh(req, res) {
    const cookieRt = req.cookies.refreshToken;

    const { accessToken, refreshToken } = await authService.refresh({
      cookieRt,
    });

    setRefreshCookie(res, refreshToken, 14);

    return res.status(201).json({
      success: true,
      message: "New access token is successfully created!",
      data: { accessToken },
    });
  },

  async logout(req, res) {
    const cookieRt = req.cookies.refreshToken;

    const { isAlreadyLoggedOut } = await authService.logout({ cookieRt });

    clearRefreshCookie(res);

    return res.status(200).json({
      success: true,
      message: isAlreadyLoggedOut
        ? "User already logged out!"
        : "User successfully logged out!",
    });
  },
};
