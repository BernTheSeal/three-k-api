import { hashPassword, comparePassword, generateUsername } from "../utils/auth";
import {
  generateRawToken,
  hashToken,
  generateFamilyId,
  calcExpiresAt,
} from "../utils/token";
import { generateAccessToken } from "../utils/auth";

import { NotFoundError, UnauthorizedError } from "../errors";

import { withTransaction } from "../lib/db";
import { userRepo } from "../repositories/user.repo";
import { authRepo } from "../repositories/auth.repo";

import { AuthService } from "../types/services/auth.service.type";

export const authService: AuthService = {
  async register(data) {
    const { email, username, password } = data;

    const passwordHash = await hashPassword(password);
    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    const user = await withTransaction(async (client) => {
      const userResponse = await userRepo.create(
        { username, is_active: false },
        client,
      );

      const { user_id, is_active } = userResponse;

      const authAccountData = {
        user_id,
        provider: "local" as const,
        provider_account_id: email,
        email,
        is_verified: false,
      };

      await authRepo.createAuthAccount(
        { ...authAccountData, password_hash: passwordHash },
        client,
      );

      await authRepo.createRt(
        {
          user_id,
          token_hash: hashedRt,
          family_id: familyId,
          expires_at: expiresAt,
        },
        client,
      );

      return { ...authAccountData, username, is_active };
    });

    const accessToken = generateAccessToken(user.user_id);

    return { accessToken, refreshToken: rt, user };
  },

  async login(data) {
    const { email, password } = data;

    const authAccountResponse = await authRepo.getAuthAccountWithPassword({
      provider: "local",
      provider_account_id: email,
    });

    if (!authAccountResponse || !authAccountResponse.password_hash) {
      throw new UnauthorizedError(
        "Email or password is not correct!",
        "EMAIL_OR_PASSWORD_NOT_CORRECT",
      );
    }

    const isMatch = await comparePassword(
      password,
      authAccountResponse.password_hash,
    );

    if (!isMatch) {
      throw new UnauthorizedError(
        "Email or password is not correct!",
        "EMAIL_OR_PASSWORD_NOT_CORRECT",
      );
    }

    const user_id = authAccountResponse.user_id;

    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    await authRepo.createRt({
      token_hash: hashedRt,
      user_id: user_id,
      family_id: familyId,
      expires_at: expiresAt,
    });

    const user = await userRepo.getById({ user_id });

    if (!user) throw new NotFoundError("User not found!", "USER_NOT_FOUND");

    const accessToken = generateAccessToken(user_id);

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        is_active: user.is_active,
        provider: authAccountResponse.provider,
        provider_account_id: authAccountResponse.provider_account_id,
        email: authAccountResponse.email,
        is_verified: authAccountResponse.is_verified,
      },
      accessToken,
      refreshToken: rt,
    };
  },

  async loginGoogle(data) {
    const { userGoogle } = data;

    if (!userGoogle) {
      throw new UnauthorizedError(
        "Google authentication failed!",
        "GOOGLE_AUTH_FAILED",
      );
    }

    const { email, sub } = userGoogle._json;

    if (!email) {
      throw new UnauthorizedError(
        "Google account does not have an email address!",
        "GOOGLE_NO_EMAIL",
      );
    }

    const authAccountResponse = await authRepo.getAuthAccount({
      provider: "google",
      provider_account_id: sub,
    });

    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    if (authAccountResponse) {
      const userResponse = await userRepo.getById({
        user_id: authAccountResponse.user_id,
      });

      if (!userResponse)
        throw new NotFoundError("User not found!", "USER_NOT_FOUND");

      await authRepo.createRt({
        user_id: userResponse.user_id,
        token_hash: hashedRt,
        family_id: familyId,
        expires_at: expiresAt,
      });

      const accessToken = generateAccessToken(userResponse.user_id);

      const user = {
        user_id: userResponse.user_id,
        username: userResponse.username,
        is_active: userResponse.is_active,
        provider: authAccountResponse.provider,
        provider_account_id: authAccountResponse.provider_account_id,
        email: authAccountResponse.email,
        is_verified: authAccountResponse.is_verified,
      };

      return { user, accessToken, refreshToken: rt };
    } else {
      const randomUsername = generateUsername(email);

      const newUser = await withTransaction(async (client) => {
        const userResponse = await userRepo.create(
          { username: randomUsername, is_active: true },
          client,
        );

        const authAccountData = {
          user_id: userResponse.user_id,
          provider: "google" as const,
          provider_account_id: sub,
          email: email,
          is_verified: true,
          password_hash: null,
        };

        await authRepo.createAuthAccount(authAccountData, client);

        await authRepo.createRt(
          {
            user_id: userResponse.user_id,
            token_hash: hashedRt,
            family_id: familyId,
            expires_at: expiresAt,
          },
          client,
        );

        return {
          user_id: userResponse.user_id,
          username: randomUsername,
          is_active: userResponse.is_active,
          provider: authAccountData.provider,
          provider_account_id: sub,
          email,
          is_verified: true,
        };
      });

      const accessToken = generateAccessToken(newUser.user_id);

      return { user: newUser, accessToken, refreshToken: rt };
    }
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
