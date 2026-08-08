import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type UnauthorizedErrorConst = {
  message: string;
  code: string;
  isOperational?: boolean;
};

export class UnauthorizedError extends AppError {
  constructor({ message, code, isOperational }: UnauthorizedErrorConst) {
    super({ message, statusCode: HTTP_STATUS.UNAUTHORIZED, code, details: [], isOperational: isOperational ?? true });
  }
}
