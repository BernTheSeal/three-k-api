import { AppError } from "./AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

export class InternalServerError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.error.INTERNAL_SERVER_ERROR, code, [], false);
  }
}
