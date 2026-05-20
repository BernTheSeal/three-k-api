import { withTransaction } from "../lib/db";

import {
  authAccountRepo,
  refreshTokenRepo,
  userRepo,
  verificationTokenRepo,
} from "../repositories";

import { NotFoundError, UnauthorizedError, BadRequestError } from "../errors";

import { hashPassword, comparePassword, generateUsername } from "../utils/auth";
import {
  generateRawToken,
  hashToken,
  generateFamilyId,
  calcExpiresAt,
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

    const user = await withTransaction(async (client) => {
      const userResponse = await userRepo.create(
        { username, is_active: false },
        { client },
      );

      const { user_id, is_active } = userResponse;

      const authAccountData = {
        user_id,
        provider: "local" as const,
        provider_account_id: email,
        email,
        is_verified: false,
      };

      await authAccountRepo.create(
        { ...authAccountData, password_hash: passwordHash },
        { client },
      );

      await refreshTokenRepo.create(
        {
          user_id,
          token_hash: hashedRt,
          family_id: familyId,
          expires_at: expiresAt,
        },
        { client },
      );

      return { ...authAccountData, username, is_active };
    });

    const accessToken = generateAccessToken(user.user_id);

    return { accessToken, refreshToken: rt, user };
  },

  async login(data) {
    const { email, password } = data;

    const authAccountResponse = await authAccountRepo.findByProviderAccountId({
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

    await refreshTokenRepo.create({
      token_hash: hashedRt,
      user_id: user_id,
      family_id: familyId,
      expires_at: expiresAt,
    });

    const user = await userRepo.findById({ user_id });

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

    const rt = generateRawToken();
    const hashedRt = hashToken(rt);
    const familyId = generateFamilyId();
    const expiresAt = calcExpiresAt(14);

    const authAccountResponse = await authAccountRepo.findByProviderAccountId({
      provider_account_id: sub,
      provider: "google",
    });

    if (authAccountResponse) {
      const userResponse = await userRepo.findById({
        user_id: authAccountResponse.user_id,
      });

      if (!userResponse) {
        throw new NotFoundError("User not found!", "USER_NOT_FOUND");
      }

      await refreshTokenRepo.create({
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
          { client },
        );

        const authAccountData = {
          user_id: userResponse.user_id,
          provider: "google" as const,
          provider_account_id: sub,
          email: email,
          is_verified: true,
          password_hash: null,
        };

        await authAccountRepo.create(authAccountData, { client });

        await refreshTokenRepo.create(
          {
            user_id: userResponse.user_id,
            token_hash: hashedRt,
            family_id: familyId,
            expires_at: expiresAt,
          },
          { client },
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
      const refreshToken = await refreshTokenRepo.findByToken(
        {
          token_hash: hashedCookieRt,
        },
        { client, lock: true },
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
          await refreshTokenRepo.revoke({
            by: { family_id },
            reason: "suspect",
          });
        }

        throw new UnauthorizedError(
          "Refresh token has already been used!",
          "REFRESH_TOKEN_ALREADY_USED",
        );
      }

      if (new Date(expires_at) < new Date()) {
        await refreshTokenRepo.revoke({ by: { family_id }, reason: "expired" });

        throw new UnauthorizedError(
          "Refresh token has expired!",
          "REFRESH_TOKEN_EXPIRED",
        );
      }

      const newRefreshToken = generateRawToken();
      const newHashedRefreshToken = hashToken(newRefreshToken);
      const expiresAt = calcExpiresAt(14);

      await refreshTokenRepo.create(
        {
          token_hash: newHashedRefreshToken,
          user_id,
          family_id,
          expires_at: expiresAt,
        },
        { client },
      );
      await refreshTokenRepo.revoke(
        { by: { token_hash }, reason: "refresh" },
        { client },
      );

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
    const { user_id } = data;

    const MINUTE = 15;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = hashToken(code);
    const expiresAt = new Date(Date.now() + MINUTE * 60 * 1000);

    const authAccount = await withTransaction(async (client) => {
      const authAccount = await authAccountRepo.findByUserId(
        {
          user_id,
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

      await verificationTokenRepo.revoke(
        {
          auth_account_id: authAccount.auth_account_id,
          token_type: "verification_email",
        },
        { client },
      );

      await verificationTokenRepo.create(
        {
          auth_account_id: authAccount.auth_account_id,
          token_hash: hashedCode,
          token_type: "verification_email",
          expires_at: expiresAt,
        },
        { client },
      );

      return authAccount;
    });

    await emailService.sendEmailVerificationCode({
      email: authAccount.email,
      code,
      expiresIn: MINUTE,
    });

    return { expires_in: MINUTE * 60 };
  },

  async verifyEmail(data) {
    const { user_id, code } = data;

    await withTransaction(async (client) => {
      const verificationToken = await verificationTokenRepo.findByUserId(
        {
          user_id,
          token_type: "verification_email",
          is_active: true,
        },
        { lock: true, client },
      );

      if (!verificationToken) {
        throw new BadRequestError(
          "Invalid verification code!",
          "INVALID_VERIFICATION_CODE",
        );
      }

      if (verificationToken.expires_at < new Date()) {
        throw new BadRequestError(
          "Verification code has expired!",
          "VERIFICATION_CODE_EXPIRED",
        );
      }

      const hashedCode = hashToken(code);

      if (hashedCode !== verificationToken.token_hash) {
        throw new BadRequestError(
          "Invalid verification code!",
          "INVALID_VERIFICATION_CODE",
        );
      }

      await userRepo.activateById({ user_id }, { client });

      await verificationTokenRepo.markAsUsedById(
        {
          verification_token_id: verificationToken.verification_token_id,
        },
        { client },
      );

      await authAccountRepo.verifyById(
        {
          auth_account_id: verificationToken.auth_account_id,
        },
        { client },
      );
    });

    return;
  },
};
