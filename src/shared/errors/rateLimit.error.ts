import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type RateLimitErrorConst = {
  message: string;
  code: string;
};

export class RateLimitError extends AppError {
  constructor({ message, code }: RateLimitErrorConst) {
    super({ message, statusCode: HTTP_STATUS.TOO_MANY_REQUESTS, code, details: [], isOperational: true });
  }
}
