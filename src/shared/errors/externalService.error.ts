import { ErrorStatusCode } from "../types/statusCode";
import { AppError } from "./app.error";

export class ExternalServiceError extends AppError {
  private readonly service: unknown;

  constructor(message: string, statusCode: ErrorStatusCode, service: string, cause: unknown) {
    super(message, statusCode, "EXTERNAL_SERVICE_ERROR", [], true, cause);
    this.service = service;
  }
}
