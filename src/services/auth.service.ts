import { withTransaction } from "../lib/db";

import {
  authAccountRepo,
  refreshTokenRepo,
  userRepo,
  authTokenRepo,
} from "../repositories";

import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  RefreshTokenError,
} from "../errors";

import { hashPassword, comparePassword, generateUsername } from "../utils/auth";
import {
  generateRawToken,
  hashToken,
  generateFamilyId,
  calcExpiresAt,
  generateOtpCode,
} from "../utils/token";
import { generateAccessToken } from "../utils/auth";

import { emailService } from "./email.service";
import { AuthService } from "../types/services/auth.service.type";

export const authService: AuthService = {
  async register(data) {
    const { email, username, password } = data;

    const passwordHash = await hashPassword(password);
    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    const { user, authAccount } = await withTransaction(async (client) => {
      const user = await userRepo.create(
        { username, is_active: true },
        { client },
      );

      const authAccount = await authAccountRepo.create(
        {
          user_id: user.user_id,
          provider: "local",
          provider_account_id: email,
          email,
          is_verified: false,
          password_hash: passwordHash,
        },
        { client },
      );

      await refreshTokenRepo.create(
        {
          auth_account_id: authAccount.auth_account_id,
          token_hash: hashedRt,
          family_id: familyId,
          expires_at: expiresAt,
        },
        { client },
      );

      return { user, authAccount };
    });

    const accessToken = generateAccessToken(
      user.user_id,
      familyId,
      authAccount.auth_account_id,
    );

    return { accessToken, refreshToken: rt, user: { ...user, ...authAccount } };
  },

  async login(data) {
    const { email, password } = data;

    const authAccount = await authAccountRepo.findByProviderAccountId({
      provider: "local",
      provider_account_id: email,
    });

    if (!authAccount || !authAccount.password_hash) {
      throw new UnauthorizedError(
        "Email or password is not correct!",
        "EMAIL_OR_PASSWORD_NOT_CORRECT",
      );
    }

    const isMatch = await comparePassword(password, authAccount.password_hash);

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

    await refreshTokenRepo.create({
      token_hash: hashedRt,
      auth_account_id: authAccount.auth_account_id,
      family_id: familyId,
      expires_at: expiresAt,
    });

    const user = await userRepo.findById({ user_id: authAccount.user_id });

    if (!user) throw new NotFoundError("User not found!", "USER_NOT_FOUND");

    const accessToken = generateAccessToken(
      user.user_id,
      familyId,
      authAccount.auth_account_id,
    );

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        is_active: user.is_active,
        provider: authAccount.provider,
        provider_account_id: authAccount.provider_account_id,
        email: authAccount.email,
        is_verified: authAccount.is_verified,
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

    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    const authAccount = await authAccountRepo.findByProviderAccountId({
      provider_account_id: sub,
      provider: "google",
    });

    if (authAccount) {
      const user = await userRepo.findById({
        user_id: authAccount.user_id,
      });

      if (!user) {
        throw new NotFoundError("User not found!", "USER_NOT_FOUND");
      }

      await refreshTokenRepo.create({
        auth_account_id: authAccount.auth_account_id,
        token_hash: hashedRt,
        family_id: familyId,
        expires_at: expiresAt,
      });

      const accessToken = generateAccessToken(
        user.user_id,
        familyId,
        authAccount.auth_account_id,
      );

      const data = {
        user_id: user.user_id,
        username: user.username,
        is_active: user.is_active,
        provider: authAccount.provider,
        provider_account_id: authAccount.provider_account_id,
        email: authAccount.email,
        is_verified: authAccount.is_verified,
      };

      return { user: data, accessToken, refreshToken: rt };
    } else {
      const randomUsername = generateUsername(email);

      const newUser = await withTransaction(async (client) => {
        const user = await userRepo.create(
          { username: randomUsername, is_active: true },
          { client },
        );

        const authAccountData = {
          user_id: user.user_id,
          provider: "google" as const,
          provider_account_id: sub,
          email: email,
          is_verified: true,
          password_hash: null,
        };

        const authAccount = await authAccountRepo.create(authAccountData, {
          client,
        });

        await refreshTokenRepo.create(
          {
            auth_account_id: authAccount.auth_account_id,
            token_hash: hashedRt,
            family_id: familyId,
            expires_at: expiresAt,
          },
          { client },
        );

        return {
          user_id: user.user_id,
          username: randomUsername,
          auth_account_id: authAccount.auth_account_id,
          is_active: user.is_active,
          provider: authAccountData.provider,
          provider_account_id: sub,
          email,
          is_verified: true,
        };
      });

      const accessToken = generateAccessToken(
        newUser.user_id,
        familyId,
        newUser.auth_account_id,
      );

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

    const newRawRefreshToken = generateRawToken();
    const newHashedRefreshToken = hashToken(newRawRefreshToken);
    const expiresAt = calcExpiresAt(14);

    let user_id: number | null = null;
    let family_id: string | null = null;
    let auth_account_id: number | null = null;

    try {
      const data = await withTransaction(async (client) => {
        const rt = await refreshTokenRepo.findByTokenWithAuthAccount(
          {
            token_hash: hashedCookieRt,
          },
          { client, lock: true },
        );

        if (!rt) {
          throw new UnauthorizedError(
            "Refresh token is not found in database!",
            "REFRESH_TOKEN_NOT_FOUND_IN_DB",
          );
        }

        if (rt.is_revoked) {
          if (rt.revoked_reason === "refresh") {
            throw new RefreshTokenError(rt.family_id, "suspect");
          }

          throw new UnauthorizedError(
            "Refresh token has already been used!",
            "REFRESH_TOKEN_ALREADY_USED",
          );
        }

        if (new Date(rt.expires_at) < new Date()) {
          throw new RefreshTokenError(rt.family_id, "expired");
        }

        await refreshTokenRepo.revoke(
          { by: { token_hash: rt.token_hash }, reason: "refresh" },
          { client },
        );

        await refreshTokenRepo.create(
          {
            token_hash: newHashedRefreshToken,
            auth_account_id: rt.auth_account_id,
            family_id: rt.family_id,
            expires_at: expiresAt,
          },
          { client },
        );

        return {
          user_id: rt.user_id,
          family_id: rt.family_id,
          auth_account_id: rt.auth_account_id,
        };
      });

      user_id = data.user_id;
      family_id = data.family_id;
      auth_account_id = data.auth_account_id;
    } catch (error) {
      if (error instanceof RefreshTokenError) {
        if (error.reason === "suspect") {
          await refreshTokenRepo.revoke({
            by: { family_id: error.family_id },
            reason: error.reason,
          });

          throw new UnauthorizedError(
            "Refresh token has already been used!",
            "REFRESH_TOKEN_ALREADY_USED",
          );
        } else if (error.reason === "expired") {
          await refreshTokenRepo.revoke({
            by: { family_id: error.family_id },
            reason: error.reason,
          });

          throw new UnauthorizedError(
            "Refresh token has expired!",
            "REFRESH_TOKEN_EXPIRED",
          );
        }
      }
      throw error;
    }

    const accessToken = generateAccessToken(
      user_id,
      family_id,
      auth_account_id,
    );

    return { accessToken, rawRefreshToken: newRawRefreshToken };
  },

  async logout(data) {
    const { cookieRt } = data;
    let isAlreadyLoggedOut = true;

    if (!cookieRt) {
      return { isAlreadyLoggedOut };
    }

    const hashedCookieRt = hashToken(cookieRt);

    const refreshToken = await refreshTokenRepo.findByToken({
      token_hash: hashedCookieRt,
    });

    if (!refreshToken) {
      return { isAlreadyLoggedOut };
    }

    const { is_revoked, revoked_reason, family_id } = refreshToken;

    if (is_revoked) {
      if (revoked_reason === "refresh") {
        await refreshTokenRepo.revoke({ by: { family_id }, reason: "suspect" });
      }
      return { isAlreadyLoggedOut };
    }
    await refreshTokenRepo.revoke({ by: { family_id }, reason: "logout" });

    return { isAlreadyLoggedOut: false };
  },

  async requestEmailVerification(data) {
    const { auth_account_id } = data;

    const HOURS = 24;

    const token = generateRawToken();
    const hashedToken = hashToken(token);
    const expiresAt = new Date(Date.now() + HOURS * 60 * 60 * 1000);

    const authAccount = await withTransaction(async (client) => {
      const authAccount = await authAccountRepo.findById(
        {
          auth_account_id,
          provider: "local",
        },
        { client, lock: true },
      );

      if (!authAccount) {
        throw new NotFoundError(
          "Local account not found!",
          "LOCAL_ACCOUNT_NOT_FOUND",
        );
      }

      if (authAccount.is_verified) {
        throw new BadRequestError(
          "Account is already verified!",
          "ACCOUNT_ALREADY_VERRIFED",
        );
      }

      await authTokenRepo.revoke(
        {
          auth_account_id: authAccount.auth_account_id,
          token_type: "verification_email",
        },
        { client },
      );

      await authTokenRepo.create(
        {
          auth_account_id: authAccount.auth_account_id,
          token_hash: hashedToken,
          token_type: "verification_email",
          expires_at: expiresAt,
        },
        { client },
      );

      return authAccount;
    });

    await emailService.sendEmailVerificationUrl({
      email: authAccount.email,
      token,
      expiresIn: HOURS,
    });
  },

  async verifyEmail(data) {
    const { token } = data;

    const hashedToken = hashToken(token);

    await withTransaction(async (client) => {
      const authToken = await authTokenRepo.findByToken(
        {
          token_hash: hashedToken,
        },
        { client, lock: true },
      );

      if (
        !authToken ||
        authToken.revoked_at ||
        authToken.used_at ||
        authToken.token_type !== "verification_email" ||
        authToken.expires_at <= new Date()
      ) {
        throw new BadRequestError("Invalid token!", "INVALID_TOKEN");
      }

      await authTokenRepo.markAsUsed(
        {
          auth_token_id: authToken.auth_token_id,
        },
        { client },
      );

      await authAccountRepo.verifyById(
        {
          auth_account_id: authToken.auth_account_id,
        },
        { client },
      );
    });
  },

  async changePassword(data) {
    const {
      currentPassword,
      newPassword,
      newPasswordConfirm,
      auth_account_id,
      family_id,
    } = data;

    if (newPassword !== newPasswordConfirm) {
      throw new BadRequestError(
        "New passwords do not match!",
        "PASSWORD_MISMATCH",
      );
    }

    const newPasswordHashed = await hashPassword(newPassword);

    await withTransaction(async (client) => {
      const authAccount = await authAccountRepo.findById(
        {
          auth_account_id: auth_account_id,
          provider: "local",
        },
        { client, lock: true },
      );

      if (!authAccount || authAccount.provider !== "local") {
        throw new BadRequestError(
          "No local account found.",
          "NO_LOCAL_ACCOUNT",
        );
      }

      const isCurrentPasswordCorrect = await comparePassword(
        currentPassword,
        authAccount.password_hash,
      );

      if (!isCurrentPasswordCorrect) {
        throw new BadRequestError(
          "Current password is incorrect.",
          "INVALID_CURRENT_PASSWORD",
        );
      }

      await authAccountRepo.updatePassword(
        {
          auth_account_id: authAccount.auth_account_id,
          password_hash: newPasswordHashed,
        },
        { client },
      );

      await refreshTokenRepo.revokeAllExceptCurrent(
        {
          auth_account_id,
          reason: "password_change",
          except_family_id: family_id,
        },
        { client },
      );
    });
  },

  async forgotPassword(data) {
    const { email } = data;

    const MINUTE = 15;
    const token = generateRawToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + MINUTE * 60 * 1000);

    let shouldSendEmail = false;

    await withTransaction(async (client) => {
      const authAccount = await authAccountRepo.findByEmail(
        {
          email,
          provider: "local",
        },
        { client, lock: true },
      );

      if (!authAccount) {
        return;
      }

      await authTokenRepo.revoke(
        {
          auth_account_id: authAccount.auth_account_id,
          token_type: "password_reset",
        },
        { client },
      );

      await authTokenRepo.create(
        {
          auth_account_id: authAccount.auth_account_id,
          token_type: "password_reset",
          token_hash: tokenHash,
          expires_at: expiresAt,
        },
        { client },
      );

      shouldSendEmail = true;
    });

    if (shouldSendEmail) {
      await emailService.sendPasswordResetUrl({
        token,
        email,
        expiresIn: MINUTE,
      });
    }
  },

  async resetPassword(data) {
    const { token, newPassword, newPasswordConfirm } = data;

    if (newPassword !== newPasswordConfirm) {
      throw new BadRequestError(
        "New passwords do not match!",
        "PASSWORD_MISMATCH",
      );
    }

    const hashedToken = hashToken(token);
    const hashedPassword = await hashPassword(newPassword);

    await withTransaction(async (client) => {
      const authToken = await authTokenRepo.findByToken(
        {
          token_hash: hashedToken,
        },
        { client, lock: true },
      );

      if (
        !authToken ||
        authToken.revoked_at ||
        authToken.used_at ||
        authToken.token_type !== "password_reset" ||
        authToken.expires_at <= new Date()
      ) {
        throw new BadRequestError("Invalid token!", "INVALID_TOKEN");
      }

      await authTokenRepo.markAsUsed(
        {
          auth_token_id: authToken.auth_token_id,
        },
        { client },
      );

      await authAccountRepo.updatePassword(
        {
          auth_account_id: authToken.auth_account_id,
          password_hash: hashedPassword,
        },
        { client },
      );

      await refreshTokenRepo.revokeAll(
        {
          auth_account_id: authToken.auth_account_id,
          revoked_reason: "password_change",
        },
        { client },
      );
    });
  },
};
