import { hashPassword } from "../utils/auth";
import {
  generateRawToken,
  hashToken,
  generateFamilyId,
  calcExpiresAt,
} from "../utils/token";

import { UnauthorizedError } from "../errors";
import { generateAccessToken } from "../utils/auth";
import { withTransaction } from "../lib/db";
import { userRepo } from "../repositories/user.repo";
import { authRepo } from "../repositories/auth.repo";
import { User } from "../types/entities/user";
import { comparePassword } from "../utils/auth";

type AuthService = {
  register: (
    data: Pick<User, "email" | "username"> & { password: string },
  ) => Promise<{
    accessToken: string;
    refreshToken: string;
    newUser: Omit<User, "password_hash">;
  }>;

  login: (data: Pick<User, "email"> & { password: string }) => Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "password_hash">;
  }>;

  refresh: (data: {
    cookieRt?: string;
  }) => Promise<{ accessToken: string; refreshToken: string }>;

  logout: (data: {
    cookieRt?: string;
  }) => Promise<{ isAlreadyLoggedOut: boolean }>;
};

export const authService: AuthService = {
  async register(data) {
    const { email, username, password } = data;

    const passwordHash = await hashPassword(password);
    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    const newUser = await withTransaction(async (client) => {
      const userResponse = await userRepo.create(
        {
          username,
          email,
          password_hash: passwordHash,
        },
        client,
      );

      await authRepo.createRt(
        {
          token_hash: hashedRt,
          user_id: userResponse.user_id,
          family_id: familyId,
          expires_at: expiresAt,
        },
        client,
      );

      return userResponse;
    });

    const accessToken = generateAccessToken(newUser.user_id);

    return { accessToken, refreshToken: rt, newUser };
  },

  async login(data) {
    const { email, password } = data;

    const user = await userRepo.getWithPassword({ email });

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

    await authRepo.createRt({
      token_hash: hashedRt,
      user_id: user.user_id,
      family_id: familyId,
      expires_at: expiresAt,
    });

    const accessToken = generateAccessToken(user.user_id);

    return { user, accessToken, refreshToken: rt };
  },

  async refresh(data) {
    const { cookieRt } = data;

    if (!cookieRt) {
      throw new UnauthorizedError(
        "Refresh token is not found in cookie!",
        "REFRESH_TOKEN_NOT_FOUND_IN_COOKIE",
      );
    }
    const hashedCookieRt = hashToken(cookieRt);

    const { userId, refreshToken } = await withTransaction(async (client) => {
      const refreshToken = await authRepo.getRtForUpdate(
        {
          token_hash: hashedCookieRt,
        },
        client,
      );

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
          await authRepo.revokeRt({ family_id }, "suspect");
        }

        throw new UnauthorizedError(
          "Refresh token has already been used!",
          "REFRESH_TOKEN_ALREADY_USED",
        );
      }

      if (new Date(expires_at) < new Date()) {
        await authRepo.revokeRt({ family_id }, "expired");

        throw new UnauthorizedError(
          "Refresh token has expired!",
          "REFRESH_TOKEN_EXPIRED",
        );
      }

      const newRefreshToken = generateRawToken();
      const newHashedRefreshToken = hashToken(newRefreshToken);
      const expiresAt = calcExpiresAt(14);

      await authRepo.createRt(
        {
          token_hash: newHashedRefreshToken,
          user_id,
          family_id,
          expires_at: expiresAt,
        },
        client,
      );

      await authRepo.revokeRt({ token_hash }, "refresh", client);

      return { userId: user_id, refreshToken: newRefreshToken };
    });

    const accessToken = generateAccessToken(userId);

    return { accessToken, refreshToken };
  },

  async logout(data) {
    const { cookieRt } = data;
    let isAlreadyLoggedOut = true;

    if (!cookieRt) {
      return { isAlreadyLoggedOut };
    }

    const hashedCookieRt = hashToken(cookieRt);

    const refreshToken = await authRepo.getRt({ token_hash: hashedCookieRt });

    if (!refreshToken) {
      return { isAlreadyLoggedOut };
    }

    const { is_revoked, revoked_reason, family_id } = refreshToken;

    if (is_revoked) {
      if (revoked_reason === "refresh") {
        await authRepo.revokeRt({ family_id }, "suspect");
      }
      return { isAlreadyLoggedOut };
    }

    await authRepo.revokeRt({ family_id }, "logout");

    return { isAlreadyLoggedOut: false };
  },
};
