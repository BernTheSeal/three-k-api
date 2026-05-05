import { AppError } from "./AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

export class ConflictError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.error.CONFLICT, code, []);
  }
}
