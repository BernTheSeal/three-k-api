import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "Access token is not found!",
      "ACCESS_TOKEN_NOT_FOUND",
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError(
      "Access token is not found!",
      "ACCESS_TOKEN_NOT_FOUND",
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      throw new UnauthorizedError(
        "Access token is invalid!",
        "INVALID_ACCESS_TOKEN",
      );
    }

    res.locals.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;

    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError(
        "Access token has expired!",
        "ACCESS_TOKEN_EXPIRED",
      );
    }
    throw new UnauthorizedError(
      "Access token is invalid!",
      "INVALID_ACCESS_TOKEN",
    );
  }
};
