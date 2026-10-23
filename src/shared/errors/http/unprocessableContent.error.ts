import { AppError } from "../app.error";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { ConstructorType } from "../type";

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
