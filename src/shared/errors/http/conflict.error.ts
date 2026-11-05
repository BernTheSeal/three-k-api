import { AppError } from "../app.error";
import { ConstructorType } from "../type";

import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

export class ConflictError<D extends unknown[] = []> extends AppError<D> {
  constructor(c: ConstructorType<D>) {
    super({
      message: c.message,
      code: c.code,
      statusCode: HTTP_STATUS.CONFLICT,
      isOperational: c.isOperational ?? true,
      details: c.details,
      cause: c.cause,
    });
  }
}
