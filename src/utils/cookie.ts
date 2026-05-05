import { Response } from "express";

const setRefreshCookie = (res: Response, token: string, day: number = 14) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: day * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken");
};

export { setRefreshCookie, clearRefreshCookie };
