import { AppError } from "./AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

export class BadRequestError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.error.BAD_REQUEST, code, []);
  }
}
