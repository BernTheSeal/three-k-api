import { AppError } from "../app.error";
import { ConstructorType } from "../type";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

export class InternalServerError<D extends unknown[] = []> extends AppError<D> {
  constructor(c: Omit<ConstructorType<D>, "isOperational">) {
    super({
      message: c.message,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      code: c.code,
      details: c.details,
      isOperational: false,
      cause: c.cause,
    });
  }
}
