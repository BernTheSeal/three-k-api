import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

export class RateLimitError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, code, []);
  }
}
