import { Response } from "express";
import { appConfig } from "../config/app.config";

const setSecureCookie = (res: Response, name: string, value: string, maxAgeMs: number) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: appConfig.nodeEnv === "production",
    sameSite: appConfig.nodeEnv === "production" ? "strict" : "lax",
    maxAge: maxAgeMs,
  });
};

const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name);
};

export const cookieHelper = {
  setSecureCookie,
  clearCookie,
};
