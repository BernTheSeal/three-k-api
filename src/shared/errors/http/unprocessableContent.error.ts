import { AppError } from "../app.error";
import { ConstructorType } from "../type";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

export class UnprocessableContentError<D extends unknown[]> extends AppError<D> {
  constructor(c: ConstructorType<D>) {
    super({
      message: c.message,
      statusCode: HTTP_STATUS.UNPROCESSABLE_CONTENT,
      code: c.code,
      details: c.details,
      isOperational: c.isOperational ?? true,
      cause: c.cause,
    });
  }
}
