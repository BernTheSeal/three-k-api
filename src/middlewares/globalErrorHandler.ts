import { AppError } from "../errors/AppError";
import { ErrorRequestHandler } from "express";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  console.error("ERROR =>", err);

  let message = "Internal Server Error";
  let status = 500;
  let details: unknown[] = [];
  let code = "UNKNOWN_ERROR";

  if (err instanceof AppError && err.isOperational) {
    message = err.message;
    status = err.statusCode;
    details = err.details;
    code = err.code;
  }

  res.status(status).json({
    success: false,
    message,
    details,
    code,
  });
};
