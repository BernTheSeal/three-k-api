import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

export class NotFoundError extends AppError {
  constructor(message: string, code: string) {
    super(message, HTTP_STATUS.NOT_FOUND, code, []);
  }
}
