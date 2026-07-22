import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

export class UnauthorizedError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code, []);
  }
}
