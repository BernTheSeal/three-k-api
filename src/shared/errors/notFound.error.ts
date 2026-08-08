import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type NotFoundErrorConst = {
  message: string;
  code: string;
  isOperational?: boolean;
};

export class NotFoundError extends AppError {
  constructor({ message, code, isOperational }: NotFoundErrorConst) {
    super({ message, statusCode: HTTP_STATUS.NOT_FOUND, code, details: [], isOperational: isOperational ?? true });
  }
}
