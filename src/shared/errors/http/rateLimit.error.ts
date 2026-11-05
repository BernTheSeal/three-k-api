import { AppError } from "../app.error";
import { ConstructorType } from "../type";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

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
