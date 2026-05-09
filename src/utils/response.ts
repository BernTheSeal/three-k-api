import { Response } from "express";
import { SuccessStatusCode } from "../types/statusCode";

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: SuccessStatusCode,
  message: string,
  data?: T,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
