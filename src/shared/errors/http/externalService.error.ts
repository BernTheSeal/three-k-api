import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { ConstructorType } from "../type";
import { AppError } from "../app.error";
import { ErrorStatusCode } from "@/shared/types/statusCode.type";

type Service = "CACHE" | "DICTIONARY" | "EMAIL" | "LEMMATIZE" | "DATABASE";

type ExternalServiceStatusCode = Extract<ErrorStatusCode, 502 | 503 | 504>;

type ExternalServiceConst<D extends unknown[]> = {
  service: Service;
  cause: unknown;
  upstreamStatus?: number;
  statusCode?: ExternalServiceStatusCode;
} & ConstructorType<D>;

export class ExternalServiceError<D extends unknown[] = []> extends AppError<D> {
  public readonly service: Service;
  public readonly upstreamStatus?: number;

  constructor(c: ExternalServiceConst<D>) {
    super({
      message: c.message,
      statusCode: c.statusCode ?? HTTP_STATUS.BAD_GATEWAY,
      code: c.code,
      details: c.details,
      isOperational: c.isOperational ?? true,
      cause: c.cause,
    });

    this.service = c.service;
    this.upstreamStatus = c.upstreamStatus;
  }
}
