import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

export class InternalServerError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, code, [], false);
  }
}
