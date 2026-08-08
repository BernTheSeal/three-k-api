import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type BadRequestConst = {
  message: string;
  code: string;
  isOperation?: boolean;
};

export class BadRequestError extends AppError {
  constructor({ message, code, isOperation }: BadRequestConst) {
    super({ message, statusCode: HTTP_STATUS.BAD_REQUEST, code, isOperational: isOperation ?? true, details: [] });
  }
}
