import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type ConflictErrorConst = {
  message: string;
  code: string;
  isOperational?: boolean;
};

export class ConflictError extends AppError {
  constructor({ message, code, isOperational }: ConflictErrorConst) {
    super({ message, code, statusCode: HTTP_STATUS.CONFLICT, isOperational: isOperational ?? true, details: [] });
  }
}
