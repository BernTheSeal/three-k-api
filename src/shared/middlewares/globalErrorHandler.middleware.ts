import { ErrorRequestHandler } from "express";

import { AppError } from "@/shared/errors/app.error";
import { responseHelper } from "@/shared/helpers/response.helper";
import { ErrorStatusCode } from "@/shared/types/statusCode.type";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { logUtil } from "@/shared/utils/log.util";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logUtil.error("Some error occured!", { tag: "global error handler", payload: err });

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

  responseHelper.sendError(res, statusCode, message, details, code);
};
