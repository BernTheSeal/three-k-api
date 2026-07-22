import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import { verifyAccessToken } from "@/modules/auth/auth.helper";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Access token is not found!", "ACCESS_TOKEN_NOT_FOUND");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Access token is not found!", "ACCESS_TOKEN_NOT_FOUND");
  }

  try {
    const decoded = verifyAccessToken(token);

    if (typeof decoded === "string" || !decoded || !("user_id" in decoded)) {
      throw new UnauthorizedError("Access token is invalid!", "INVALID_ACCESS_TOKEN");
    }

    res.locals.user = {
      user_id: decoded.user_id,
      family_id: decoded.family_id,
      auth_account_id: decoded.auth_account_id,
    };

    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;

    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Access token has expired!", "ACCESS_TOKEN_EXPIRED");
    }
    throw new UnauthorizedError("Access token is invalid!", "INVALID_ACCESS_TOKEN");
  }
};
