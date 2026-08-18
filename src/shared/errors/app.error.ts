import { ErrorStatusCode } from "../types/statusCode.type";

type AppErrorConst<D> = {
  message: string;
  statusCode: ErrorStatusCode;
  code: string;
  details: D;
  isOperational: boolean;
  cause?: unknown;
};

export class AppError<D extends unknown[] = []> extends Error {
  public readonly statusCode: ErrorStatusCode;
  public readonly isOperational: boolean;
  public readonly details: D;
  public readonly code: string;

  constructor({ message, statusCode, code, details, isOperational, cause }: AppErrorConst<D>) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    this.code = code;
  }
}
