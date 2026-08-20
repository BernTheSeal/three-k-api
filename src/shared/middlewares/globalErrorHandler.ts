import { AppError } from "../errors/app.error";
import { ErrorRequestHandler } from "express";
import { sendErrorResponse } from "../helpers/response.helper";
import { ErrorStatusCode } from "../types/statusCode.type";
import { HTTP_STATUS } from "../constants/httpStatus.const";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("ERROR =>", err);

  let message = "Internal Server Error";
  let statusCode: ErrorStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let details: unknown[] = [];
  let code = "UNKNOWN_ERROR";

  if (err instanceof AppError && err.isOperational) {
    message = err.message;
    statusCode = err.statusCode;
    details = err.details;
    code = err.code;
  }

  sendErrorResponse(res, statusCode, message, details, code);
};
