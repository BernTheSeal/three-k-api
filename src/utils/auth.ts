import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (passwordInput: string, password: string) => {
  return await bcrypt.compare(passwordInput, password);
};

const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
};

export { hashPassword, comparePassword, generateAccessToken };
