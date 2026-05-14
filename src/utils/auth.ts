import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (passwordInput: string, password: string) => {
  return await bcrypt.compare(passwordInput, password);
};

const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "15m",
  });
};

const generateUsername = (email: string) => {
  const base = email
    .split("@")[0]!
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 15);

  const suffix = Date.now().toString(36);
  return `${base}_${suffix}`;
};

export { hashPassword, comparePassword, generateAccessToken, generateUsername };
