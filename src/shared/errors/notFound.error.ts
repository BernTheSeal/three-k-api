import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type NotFoundErrorConst<D> = {
  message: string;
  code: string;
  isOperational?: boolean;
  details?: D;
};

export class NotFoundError<D extends unknown[] = []> extends AppError<D> {
  constructor({ message, code, isOperational, details }: NotFoundErrorConst<D>) {
    super({
      message,
      statusCode: HTTP_STATUS.NOT_FOUND,
      code,
      details: details ?? ([] as unknown as D),
      isOperational: isOperational ?? true,
    });
  }
}
