import { ErrorStatusCode } from "../types/statusCode";

export class AppError<D extends unknown[] = []> extends Error {
  public readonly statusCode: ErrorStatusCode;
  public readonly isOperational: boolean;
  public readonly details: D;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: ErrorStatusCode,
    code: string,
    details: D,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    this.code = code;
  }
}
