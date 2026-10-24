import { Response } from "express";
import { ErrorStatusCode, SuccessStatusCode } from "../types/statusCode.type";

const sendSuccess = <T>(res: Response, statusCode: SuccessStatusCode, message: string, data?: T) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = <T>(res: Response, statusCode: ErrorStatusCode, message: string, details: T, code: string) => {
  res.status(statusCode).json({
    success: false,
    message,
    details,
    code,
  });
};

export const responseHelper = {
  sendSuccess,
  sendError,
};
