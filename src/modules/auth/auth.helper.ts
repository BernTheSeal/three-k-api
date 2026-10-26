import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";

import { authConfig } from "@/shared/config/auth.config";
import { cryptoProvider } from "@/shared/lib/crypto/crypto.provider";
import { dateUtil } from "@/shared/utils/date.util";
import { cookieHelper } from "@/shared/helpers/cookie.helper";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, authConfig.password.saltRounds);
};

const comparePassword = async (passwordInput: string, password: string) => {
  return await bcrypt.compare(passwordInput, password);
};

const generateAccessToken = (userId: number, familyId: string, authAccountId: number) => {
  return jwt.sign({ userId, familyId, authAccountId }, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.accessTokenExpiresIn,
  });
};

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, authConfig.jwt.secret);
};

const generateUsername = (email: string) => {
  const base = email
    .split("@")[0]!
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 15);

  const suffix = Date.now().toString(36);
  return `${base}_${suffix}`;
};

const generateRefreshToken = () => {
  return cryptoProvider.generateRandomHex(authConfig.token.refresh.byteLength);
};

const getRefreshTokenExpiresAt = () => {
  return dateUtil.getExpiresAt(dateUtil.daysToMs(authConfig.token.refresh.expiresInDays));
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieHelper.setSecureCookie(
    res,
    authConfig.token.refresh.cookieName,
    token,
    dateUtil.daysToMs(authConfig.token.refresh.expiresInDays),
  );
};

const clearRefreshTokenCookie = (res: Response) => {
  cookieHelper.clearCookie(res, authConfig.token.refresh.cookieName);
};

const generateVerifyEmailToken = () => {
  return cryptoProvider.generateRandomHex(authConfig.token.verifyEmail.byteLength);
};

const getVerifyEmailTokenExpiresAt = () => {
  return dateUtil.getExpiresAt(dateUtil.hoursToMs(authConfig.token.verifyEmail.expiresInHours));
};

const generateResetPasswordToken = () => {
  return cryptoProvider.generateRandomHex(authConfig.token.resetPassword.byteLength);
};

const getResetPasswordTokenExpiresAt = () => {
  return dateUtil.getExpiresAt(dateUtil.hoursToMs(authConfig.token.resetPassword.expiresInHours));
};

const hashAuthToken = cryptoProvider.sha256;

const generateFamilyId = () => {
  return cryptoProvider.generateUUID();
};

export const authHelper = {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateUsername,
  generateRefreshToken,
  generateFamilyId,
  getRefreshTokenExpiresAt,
  generateVerifyEmailToken,
  generateResetPasswordToken,
  hashAuthToken,
  getVerifyEmailTokenExpiresAt,
  getResetPasswordTokenExpiresAt,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  verifyAccessToken,
};
