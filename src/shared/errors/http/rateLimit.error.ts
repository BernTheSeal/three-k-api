import { AppError } from "../app.error";
import { HTTP_STATUS } from "../../constants/httpStatus.const";
import { ConstructorType } from "../type";

export class RateLimitError<D extends unknown[] = []> extends AppError<D> {
  constructor(c: Omit<ConstructorType<D>, "isOperational">) {
    super({
      message: c.message,
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      code: c.code,
      details: c.details,
      cause: c.cause,
      isOperational: true,
    });
  }
}
