import { Response } from "express";
import { env } from "../config/env";

const setRefreshCookie = (res: Response, token: string, day: number = 14) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "strict" : "lax",
    maxAge: day * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken");
};

export { setRefreshCookie, clearRefreshCookie };
