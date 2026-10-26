import { authAccountRepo } from "./authAccount/authAccount.repo";
import { refreshTokenRepo } from "./refreshToken/refreshToken.repo";
import { authTokenRepo } from "./authToken/authToken.repo";
import { authHelper } from "./auth.helper";
import { authEmail } from "./auth.email";
import {
  Register,
  Login,
  LoginGoogle,
  Refresh,
  Logout,
  RequestEmailVerification,
  VerifyEmail,
  ChangePassword,
  ForgotPassword,
  ResetPassword,
} from "./auth.service.type";

import { userRepo } from "@/modules/user";
import { NotFoundError, UnauthorizedError, BadRequestError, InternalServerError, RefreshTokenError } from "@/shared/errors";
import { dbProvider } from "@/shared/lib/db";

const register: Register = async (input) => {
  const { email, username, password } = input;

  const hashedPassword = await authHelper.hashPassword(password);
  const rt = authHelper.generateRefreshToken();
  const hashedRt = authHelper.hashAuthToken(rt);
  const familyId = authHelper.generateFamilyId();
  const expiresAt = authHelper.getRefreshTokenExpiresAt();

  const { user, authAccount } = await dbProvider.withTransaction(async (client) => {
    const user = await userRepo.create({ username, isActive: true }, { client });

    const authAccount = await authAccountRepo.create(
      {
        userId: user.userId,
        provider: "local",
        providerAccountId: email,
        email,
        isVerified: false,
        passwordHash: hashedPassword,
      },
      { client },
    );

    await refreshTokenRepo.create(
      {
        authAccountId: authAccount.authAccountId,
        tokenHash: hashedRt,
        familyId,
        expiresAt,
      },
      { client },
    );

    return { user, authAccount };
  });

  const accessToken = authHelper.generateAccessToken(user.userId, familyId, authAccount.authAccountId);

  const { passwordHash, userId, ...safeAuthAccount } = authAccount;

  return {
    accessToken,
    refreshToken: rt,
    user,
    authAccount: safeAuthAccount,
  };
};

const login: Login = async (input) => {
  const { email, password } = input;

  const authAccount = await authAccountRepo.findByProviderAccountId({
    provider: "local",
    providerAccountId: email,
  });

  if (!authAccount || !authAccount.passwordHash) {
    throw new UnauthorizedError({ message: "Email or password is not correct!", code: "EMAIL_OR_PASSWORD_NOT_CORRECT" });
  }

  const isMatch = await authHelper.comparePassword(password, authAccount.passwordHash);

  if (!isMatch) {
    throw new UnauthorizedError({ message: "Email or password is not correct!", code: "EMAIL_OR_PASSWORD_NOT_CORRECT" });
  }

  const rt = authHelper.generateRefreshToken();
  const hashedRt = authHelper.hashAuthToken(rt);
  const familyId = authHelper.generateFamilyId();
  const expiresAt = authHelper.getRefreshTokenExpiresAt();

  const user = await userRepo.findById({ userId: authAccount.userId });

  if (!user) {
    throw new InternalServerError({ message: "Auth account exists but linked user not found", code: "USER_DATA_INCONSISTENT" });
  }

  await refreshTokenRepo.create({
    tokenHash: hashedRt,
    authAccountId: authAccount.authAccountId,
    familyId,
    expiresAt,
  });

  const accessToken = authHelper.generateAccessToken(user.userId, familyId, authAccount.authAccountId);

  const { userId, passwordHash, ...safeAuthAccount } = authAccount;

  return {
    user,
    authAccount: safeAuthAccount,
    accessToken,
    refreshToken: rt,
  };
};

const loginGoogle: LoginGoogle = async (input) => {
  const { userGoogle } = input;

  if (!userGoogle) {
    throw new UnauthorizedError({ message: "Google authentication failed!", code: "GOOGLE_AUTH_FAILED" });
  }

  const { email, sub } = userGoogle._json;

  if (!email) {
    throw new UnauthorizedError({ message: "Google account does not have an email address!", code: "GOOGLE_NO_EMAIL" });
  }

  const rt = authHelper.generateRefreshToken();
  const hashedRt = authHelper.hashAuthToken(rt);
  const familyId = authHelper.generateFamilyId();
  const expiresAt = authHelper.getRefreshTokenExpiresAt();

  const authAccount = await authAccountRepo.findByProviderAccountId({
    providerAccountId: sub,
    provider: "google",
  });

  if (authAccount) {
    const user = await userRepo.findById({
      userId: authAccount.userId,
    });

    if (!user) {
      throw new InternalServerError({ message: "Auth account exists but linked user not found", code: "USER_DATA_INCONSISTENT" });
    }

    await refreshTokenRepo.create({
      authAccountId: authAccount.authAccountId,
      tokenHash: hashedRt,
      familyId: familyId,
      expiresAt,
    });

    const accessToken = authHelper.generateAccessToken(user.userId, familyId, authAccount.authAccountId);

    const { userId, passwordHash, ...safeAuthAccount } = authAccount;

    return {
      user,
      authAccount: safeAuthAccount,
      accessToken,
      refreshToken: rt,
    };
  } else {
    const randomUsername = authHelper.generateUsername(email);

    const data = await dbProvider.withTransaction(async (client) => {
      const user = await userRepo.create({ username: randomUsername, isActive: true }, { client });

      const authAccount = await authAccountRepo.create(
        {
          userId: user.userId,
          provider: "google",
          providerAccountId: sub,
          email,
          isVerified: true,
          passwordHash: null,
        },
        {
          client,
        },
      );

      await refreshTokenRepo.create(
        {
          authAccountId: authAccount.authAccountId,
          tokenHash: hashedRt,
          familyId,
          expiresAt,
        },
        { client },
      );

      return { user, authAccount };
    });

    const accessToken = authHelper.generateAccessToken(data.user.userId, familyId, data.authAccount.authAccountId);

    const { userId, passwordHash, ...safeAuthAccount } = data.authAccount;

    return {
      user: data.user,
      authAccount: safeAuthAccount,
      accessToken,
      refreshToken: rt,
    };
  }
};

const refresh: Refresh = async (input) => {
  const { cookie } = input;

  if (!cookie) {
    throw new UnauthorizedError({ message: "Refresh token is not found in cookie!", code: "REFRESH_TOKEN_NOT_FOUND_IN_COOKIE" });
  }
  const hashedCookieRt = authHelper.hashAuthToken(cookie);

  const newRawRefreshToken = authHelper.generateRefreshToken();
  const newHashedRefreshToken = authHelper.hashAuthToken(newRawRefreshToken);
  const expiresAt = authHelper.getRefreshTokenExpiresAt();

  let userId: number | null = null;
  let familyId: string | null = null;
  let authAccountId: number | null = null;

  try {
    const data = await dbProvider.withTransaction(async (client) => {
      const rt = await refreshTokenRepo.findByTokenHashWithAuthAccount(
        {
          tokenHash: hashedCookieRt,
        },
        { client, lock: true },
      );

      if (!rt) {
        throw new UnauthorizedError({
          message: "Refresh token is not found in database!",
          code: "REFRESH_TOKEN_NOT_FOUND_IN_DB",
        });
      }

      if (rt.isRevoked) {
        if (rt.revokedReason === "refresh") {
          throw new RefreshTokenError({ familyId: rt.familyId, reason: "suspect" });
        }

        throw new UnauthorizedError({ message: "Refresh token has already been used!", code: "REFRESH_TOKEN_ALREADY_USED" });
      }

      if (new Date(rt.expiresAt) < new Date()) {
        throw new RefreshTokenError({ familyId: rt.familyId, reason: "expired" });
      }

      await refreshTokenRepo.revokeByTokenHash(
        {
          tokenHash: rt.tokenHash,
          revokedReason: "refresh",
        },
        { client },
      );

      await refreshTokenRepo.create(
        {
          tokenHash: newHashedRefreshToken,
          authAccountId: rt.authAccountId,
          familyId: rt.familyId,
          expiresAt,
        },
        { client },
      );

      return {
        userId: rt.userId,
        familyId: rt.familyId,
        authAccountId: rt.authAccountId,
      };
    });

    userId = data.userId;
    familyId = data.familyId;
    authAccountId = data.authAccountId;
  } catch (error) {
    if (error instanceof RefreshTokenError) {
      if (error.reason === "suspect") {
        await refreshTokenRepo.revokeByFamilyId({
          familyId: error.familyId,
          revokedReason: error.reason,
        });

        throw new UnauthorizedError({ message: "Refresh token has already been used!", code: "REFRESH_TOKEN_ALREADY_USED" });
      } else if (error.reason === "expired") {
        await refreshTokenRepo.revokeByFamilyId({
          familyId: error.familyId,
          revokedReason: error.reason,
        });

        throw new UnauthorizedError({ message: "Refresh token has expired!", code: "REFRESH_TOKEN_EXPIRED" });
      }
    }
    throw error;
  }

  const accessToken = authHelper.generateAccessToken(userId, familyId, authAccountId);

  return { accessToken, refreshToken: newRawRefreshToken };
};

const logout: Logout = async (input) => {
  const { cookie } = input;
  let isAlreadyLoggedOut = true;

  if (!cookie) {
    return { isAlreadyLoggedOut };
  }

  const hashedCookieRt = authHelper.hashAuthToken(cookie);

  const refreshToken = await refreshTokenRepo.findByTokenHash({
    tokenHash: hashedCookieRt,
  });

  if (!refreshToken) {
    return { isAlreadyLoggedOut };
  }

  const { isRevoked, revokedReason, familyId } = refreshToken;

  if (isRevoked) {
    if (revokedReason === "refresh") {
      await refreshTokenRepo.revokeByFamilyId({
        familyId,
        revokedReason: "suspect",
      });
    }
    return { isAlreadyLoggedOut };
  }
  await refreshTokenRepo.revokeByFamilyId({
    familyId,
    revokedReason: "logout",
  });

  return { isAlreadyLoggedOut: false };
};

const requestEmailVerification: RequestEmailVerification = async (input) => {
  const { authAccountId } = input;

  const token = authHelper.generateVerifyEmailToken();
  const hashedToken = authHelper.hashAuthToken(token);
  const expiresAt = authHelper.getVerifyEmailTokenExpiresAt();

  const authAccount = await dbProvider.withTransaction(async (client) => {
    const authAccount = await authAccountRepo.findById(
      {
        authAccountId,
        provider: "local",
      },
      { client, lock: true },
    );

    if (!authAccount) {
      throw new NotFoundError({ message: "Local account not found!", code: "LOCAL_ACCOUNT_NOT_FOUND" });
    }

    if (authAccount.isVerified) {
      throw new BadRequestError({ message: "Account is already verified!", code: "ACCOUNT_ALREADY_VERRIFED" });
    }

    await authTokenRepo.revoke(
      {
        authAccountId: authAccount.authAccountId,
        tokenType: "verification_email",
      },
      { client },
    );

    await authTokenRepo.create(
      {
        authAccountId: authAccount.authAccountId,
        tokenHash: hashedToken,
        tokenType: "verification_email",
        expiresAt,
      },
      { client },
    );

    return authAccount;
  });

  await authEmail.sendEmailVerificationUrl({
    email: authAccount.email,
    token,
  });
};

const verifyEmail: VerifyEmail = async (input) => {
  const { token } = input;

  const hashedToken = authHelper.hashAuthToken(token);

  await dbProvider.withTransaction(async (client) => {
    const authToken = await authTokenRepo.findByToken(
      {
        tokenHash: hashedToken,
      },
      { client, lock: true },
    );

    if (
      !authToken ||
      authToken.revokedAt ||
      authToken.usedAt ||
      authToken.tokenType !== "verification_email" ||
      authToken.expiresAt <= new Date()
    ) {
      throw new BadRequestError({ message: "Invalid token!", code: "INVALID_TOKEN" });
    }

    await authTokenRepo.markAsUsed(
      {
        authTokenId: authToken.authTokenId,
      },
      { client },
    );

    await authAccountRepo.verifyById(
      {
        authAccountId: authToken.authAccountId,
      },
      { client },
    );
  });
};

const changePassword: ChangePassword = async (input) => {
  const { currentPassword, newPassword, newPasswordConfirm, authAccountId, familyId } = input;

  if (newPassword !== newPasswordConfirm) {
    throw new BadRequestError({ message: "New passwords do not match!", code: "PASSWORD_MISMATCH" });
  }

  const newPasswordHashed = await authHelper.hashPassword(newPassword);

  await dbProvider.withTransaction(async (client) => {
    const authAccount = await authAccountRepo.findById(
      {
        authAccountId,
        provider: "local",
      },
      { client, lock: true },
    );

    if (!authAccount || authAccount.provider !== "local") {
      throw new BadRequestError({ message: "No local account found.", code: "NO_LOCAL_ACCOUNT" });
    }

    const isCurrentPasswordCorrect = await authHelper.comparePassword(currentPassword, authAccount.passwordHash);

    if (!isCurrentPasswordCorrect) {
      throw new BadRequestError({ message: "Current password is incorrect.", code: "INVALID_CURRENT_PASSWORD" });
    }

    await authAccountRepo.updatePassword(
      {
        authAccountId: authAccount.authAccountId,
        passwordHash: newPasswordHashed,
      },
      { client },
    );

    await refreshTokenRepo.revokeByAuthAccountIdExceptFamilyId(
      {
        authAccountId,
        revokedReason: "password_change",
        familyId,
      },
      { client },
    );
  });
};

const forgotPassword: ForgotPassword = async (input) => {
  const { email } = input;

  const token = authHelper.generateResetPasswordToken();
  const tokenHash = authHelper.hashAuthToken(token);
  const expiresAt = authHelper.getResetPasswordTokenExpiresAt();

  let shouldSendEmail = false;

  await dbProvider.withTransaction(async (client) => {
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
        authAccountId: authAccount.authAccountId,
        tokenType: "password_reset",
      },
      { client },
    );

    await authTokenRepo.create(
      {
        authAccountId: authAccount.authAccountId,
        tokenType: "password_reset",
        tokenHash,
        expiresAt,
      },
      { client },
    );

    shouldSendEmail = true;
  });

  if (shouldSendEmail) {
    await authEmail.sendPasswordResetUrl({
      token,
      email,
    });
  }
};

const resetPassword: ResetPassword = async (input) => {
  const { token, newPassword, newPasswordConfirm } = input;

  if (newPassword !== newPasswordConfirm) {
    throw new BadRequestError({ message: "New passwords do not match!", code: "PASSWORD_MISMATCH" });
  }

  const hashedToken = authHelper.hashAuthToken(token);
  const hashedPassword = await authHelper.hashPassword(newPassword);

  await dbProvider.withTransaction(async (client) => {
    const authToken = await authTokenRepo.findByToken(
      {
        tokenHash: hashedToken,
      },
      { client, lock: true },
    );

    if (
      !authToken ||
      authToken.revokedAt ||
      authToken.usedAt ||
      authToken.tokenType !== "password_reset" ||
      authToken.expiresAt <= new Date()
    ) {
      throw new BadRequestError({ message: "Invalid token!", code: "INVALID_TOKEN" });
    }

    await authTokenRepo.markAsUsed(
      {
        authTokenId: authToken.authTokenId,
      },
      { client },
    );

    await authAccountRepo.updatePassword(
      {
        authAccountId: authToken.authAccountId,
        passwordHash: hashedPassword,
      },
      { client },
    );

    await refreshTokenRepo.revokeByAuthAccountId(
      {
        authAccountId: authToken.authAccountId,
        revokedReason: "password_change",
      },
      { client },
    );
  });
};

export const authService = {
  register,
  login,
  logout,
  loginGoogle,
  refresh,
  requestEmailVerification,
  verifyEmail,
  changePassword,
  forgotPassword,
  resetPassword,
};
