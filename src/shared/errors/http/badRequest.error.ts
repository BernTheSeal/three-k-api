import { AppError } from "../app.error";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { ConstructorType } from "../type";

export class BadRequestError<D extends unknown[] = []> extends AppError<D> {
  constructor(c: ConstructorType<D>) {
    super({
      message: c.message,
      cause: c.cause,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      code: c.code,
      isOperational: c.isOperational ?? true,
      details: c.details,
    });
  }
}
