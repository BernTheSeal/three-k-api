import { AppError } from "./AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

export class UnauthorizedError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.error.UNAUTHORIZED, code, []);
  }
}
