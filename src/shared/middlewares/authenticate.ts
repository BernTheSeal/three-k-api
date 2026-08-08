import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";
import { verifyAccessToken } from "@/modules/auth/auth.helper";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError({ message: "Access token is not found!", code: "ACCESS_TOKEN_NOT_FOUND" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError({ message: "Access token is not found!", code: "ACCESS_TOKEN_NOT_FOUND" });
  }

  try {
    const decoded = verifyAccessToken(token);

    if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      throw new UnauthorizedError({ message: "Access token is invalid!", code: "INVALID_ACCESS_TOKEN" });
    }

    res.locals.user = {
      userId: decoded.userId,
      familyId: decoded.familyId,
      authAccountId: decoded.authAccountId,
    };

    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;

    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError({ message: "Access token has expired!", code: "ACCESS_TOKEN_EXPIRED" });
    }
    throw new UnauthorizedError({ message: "Access token is invalid!", code: "INVALID_ACCESS_TOKEN" });
  }
};
