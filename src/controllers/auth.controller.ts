import { RequestHandler } from "express";
import { RegisterDto, LoginDto } from "../schemas/validators/auth.validator";
import { query, withTransaction } from "../lib/db";
import { UnauthorizedError } from "../errors";
import {
  comparePassword,
  generateAccessToken,
  hashPassword,
} from "../utils/auth";
import {
  calcExpiresAt,
  generateFamilyId,
  generateRawToken,
  hashToken,
} from "../utils/token";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookie";

type RefreshToken = {
  token_hash: string;
  user_id: number;
  family_id: string;
  is_revoked: boolean;
  revoked_reason: null | "refresh" | "logout" | "expired" | "suspect";
  revoked_at: null | Date;
  expires_at: Date;
  created_at: Date;
};

type AuthController = {
  me: RequestHandler<{}, any, {}, {}, { userId: number }>;
  register: RequestHandler<{}, any, {}, {}, RegisterDto>;
  login: RequestHandler<{}, any, {}, {}, LoginDto>;
  refresh: RequestHandler<{}, any, {}, {}, {}>;
  logout: RequestHandler<{}, any, {}, {}, {}>;
};

export const authController: AuthController = {
  me: async (req, res, next) => {
    const userId = res.locals.userId;
    res.status(200).json({
      success: true,
      message: "you are logged in!",
      yourId: userId,
    });
  },
  register: async (req, res, next) => {
    const { username, email, password } = res.locals.body;

    const passwordHash = await hashPassword(password);
    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    const userId = await withTransaction(async (client) => {
      const userResponse = await client.query(
        `INSERT INTO users (username, email, password_hash)
        VALUES($1, $2, $3)
        RETURNING user_id
      `,
        [username, email, passwordHash],
      );

      const userId = userResponse.rows[0].user_id;

      await client.query(
        `INSERT INTO refresh_tokens (token_hash, user_id, family_id, expires_at)
        VALUES($1, $2, $3, $4)
        `,
        [hashedRt, userId, familyId, expiresAt],
      );

      return userId;
    });

    const accessToken = generateAccessToken(userId);

    setRefreshCookie(res, rt, 14);

    res.status(201).json({
      success: true,
      message: "user successfully created!",
      data: {
        accessToken,
      },
    });
    return;
  },
  login: async (req, res, next) => {
    const { email, password } = res.locals.body;

    const userResponse = await query(
      `
      SELECT user_id, email, password_hash FROM users
      WHERE email = $1  
    `,
      [email],
    );

    const user = userResponse.rows[0];

    if (!user) {
      throw new UnauthorizedError(
        "Email or password is not correct!",
        "EMAIL_OR_PASSWORD_NOT_CORRECT",
      );
    }

    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedError(
        "Email or password is not correct!",
        "EMAIL_OR_PASSWORD_NOT_CORRECT",
      );
    }

    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    await query(
      `INSERT INTO refresh_tokens (token_hash, user_id, family_id, expires_at)
        VALUES($1, $2, $3, $4)
        `,
      [hashedRt, user.user_id, familyId, expiresAt],
    );

    const accessToken = generateAccessToken(user.user_id);

    setRefreshCookie(res, rt, 14);

    res.status(200).json({
      success: true,
      message: "user successfully login!",
      data: {
        accessToken,
      },
    });
    return;
  },
  refresh: async (req, res, next) => {
    const cookieRt = req.cookies.refreshToken;

    if (!cookieRt) {
      throw new UnauthorizedError(
        "Refresh token is not found in cookie!",
        "REFRESH_TOKEN_NOT_FOUND_IN_COOKIE",
      );
    }
    const hashedCookieRt = hashToken(cookieRt);

    const { userId, refreshToken } = await withTransaction(async (client) => {
      const refresTokenResponse = await client.query<RefreshToken>(
        `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1  
      FOR UPDATE;
    `,
        [hashedCookieRt],
      );

      const refreshToken = refresTokenResponse.rows[0];

      if (!refreshToken) {
        throw new UnauthorizedError(
          "Refresh token is not found in database!",
          "REFRESH_TOKEN_NOT_FOUND_IN_DB",
        );
      }

      const {
        token_hash,
        user_id,
        family_id,
        is_revoked,
        revoked_reason,
        expires_at,
      } = refreshToken;

      if (is_revoked) {
        if (revoked_reason === "refresh") {
          await query(
            `
          UPDATE refresh_tokens
          SET is_revoked = true, revoked_reason = 'suspect', revoked_at = NOW()
          WHERE family_id = $1 AND is_revoked = false
          RETURNING token_hash
        `,
            [family_id],
          );
        }

        throw new UnauthorizedError(
          "Refresh token has already been used!",
          "REFRESH_TOKEN_ALREADY_USED",
        );
      }

      if (new Date(expires_at) < new Date()) {
        await query(
          `
          UPDATE refresh_tokens
          SET   
          is_revoked = true,
          revoked_reason = 'expired',
          revoked_at = now()
          WHERE token_hash = $1
        `,
          [token_hash],
        );

        throw new UnauthorizedError(
          "Refresh token has expired!",
          "REFRESH_TOKEN_EXPIRED",
        );
      }

      const newRefreshToken = generateRawToken();
      const newHashedRefreshToken = hashToken(newRefreshToken);
      const expiresAt = calcExpiresAt(14);

      await client.query(
        `
      INSERT INTO refresh_tokens (token_hash , user_id, family_id, expires_at)
      VALUES ($1, $2, $3, $4)
      `,
        [newHashedRefreshToken, user_id, family_id, expiresAt],
      );

      await client.query(
        `
      UPDATE refresh_tokens
      SET 
      is_revoked = true,
      revoked_reason = 'refresh',
      revoked_at = now()
      WHERE token_hash = $1
      `,
        [token_hash],
      );

      return { userId: user_id, refreshToken: newRefreshToken };
    });

    setRefreshCookie(res, refreshToken, 14);
    const accessToken = generateAccessToken(userId);

    res.status(201).json({
      status: true,
      message: "New access token is successfully created!",
      data: { accessToken },
    });

    return;
  },
  logout: async (req, res, next) => {
    const cookieRt = req.cookies.refreshToken;

    if (!cookieRt) {
      return res
        .status(200)
        .json({ success: true, message: "already logged out" });
    }

    const hashedCookieRt = hashToken(cookieRt);

    const response = await query(
      `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1
    `,
      [hashedCookieRt],
    );

    const refreshToken = response.rows[0];

    if (!refreshToken) {
      return res
        .status(200)
        .json({ success: true, message: "already logged out" });
    }

    clearRefreshCookie(res);

    const { is_revoked, revoked_reason, family_id } = refreshToken;

    if (is_revoked) {
      if (revoked_reason === "refresh") {
        await query(
          `UPDATE refresh_tokens
          SET is_revoked = true, revoked_reason = 'suspect', revoked_at = NOW()
          WHERE family_id = $1 AND is_revoked = false`,
          [family_id],
        );
      }
      return res
        .status(200)
        .json({ success: true, message: "already logged out" });
    }

    await query(
      `UPDATE refresh_tokens
      SET 
      is_revoked = true,
      revoked_reason = 'logout',
      revoked_at = NOW()
      WHERE 
      family_id = $1 AND is_revoked = false
      `,
      [family_id],
    );

    return res.status(200).json({ success: true, message: "logged out" });
  },
};
