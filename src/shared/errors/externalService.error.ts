import { ErrorStatusCode } from "../types/statusCode.type";
import { AppError } from "./app.error";

type ExternalServiceErrorConst = {
  message: string;
  statusCode: ErrorStatusCode;
  service: "CACHE" | "DICTIONARY" | "EMAIL";
  cause: unknown;
};

export class ExternalServiceError extends AppError {
  private readonly service: unknown;

  constructor({ message, statusCode, service, cause }: ExternalServiceErrorConst) {
    super({ message, statusCode, code: "EXTERNAL_SERVICE_ERROR", details: [], isOperational: true, cause });
    this.service = service;
  }
}
