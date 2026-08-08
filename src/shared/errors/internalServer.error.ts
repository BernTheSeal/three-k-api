import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type InternalServerErrorConst = {
  message: string;
  code: string;
};

export class InternalServerError extends AppError {
  constructor({ message, code }: InternalServerErrorConst) {
    super({ message, statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, code, details: [], isOperational: false });
  }
}
