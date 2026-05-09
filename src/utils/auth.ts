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

export { hashPassword, comparePassword, generateAccessToken };
