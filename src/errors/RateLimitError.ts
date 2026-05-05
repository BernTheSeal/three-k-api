import { AppError } from "./AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

export class RateLimitError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.error.TOO_MANY_REQUESTS, code, []);
  }
}
