import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authConfig } from "@/shared/config/auth.config";
import { generateRandomHex, sha256, generateUUID } from "@/shared/lib/crypto.lib";
import { getExpiresAt, HOURS, DAYS } from "@/shared/utils/date.util";
import { setSecureCookie, clearCookie } from "@/shared/utils/cookie.util";
import { Response } from "express";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, authConfig.password.saltRounds);
};

const comparePassword = async (passwordInput: string, password: string) => {
  return await bcrypt.compare(passwordInput, password);
};

const generateAccessToken = (user_id: number, family_id: string, auth_account_id: number) => {
  return jwt.sign({ user_id, family_id, auth_account_id }, authConfig.jwt.secret, {
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
  return generateRandomHex(authConfig.token.refresh.byteLength);
};

const getRefreshTokenExpiresAt = () => {
  return getExpiresAt(DAYS(authConfig.token.refresh.expiresInDays));
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  setSecureCookie(res, authConfig.token.refresh.cookieName, token, DAYS(authConfig.token.refresh.expiresInDays));
};

const clearRefreshTokenCookie = (res: Response) => {
  clearCookie(res, authConfig.token.refresh.cookieName);
};

const generateVerifyEmailToken = () => {
  return generateRandomHex(authConfig.token.verifyEmail.byteLength);
};

const getVerifyEmailTokenExpiresAt = () => {
  return getExpiresAt(HOURS(authConfig.token.verifyEmail.expiresInHours));
};

const generateResetPasswordToken = () => {
  return generateRandomHex(authConfig.token.resetPassword.byteLength);
};

const getResetPasswordTokenExpiresAt = () => {
  return getExpiresAt(HOURS(authConfig.token.resetPassword.expiresInHours));
};

const hashAuthToken = sha256;

const generateFamilyId = () => {
  return generateUUID();
};

export {
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
