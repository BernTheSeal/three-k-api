import { ErrorStatusCode } from "../types/statusCode.type";
import { ConstructorType } from "./type";

type AppErrorConst<D extends unknown[]> = { statusCode: ErrorStatusCode } & ConstructorType<D>;

export class AppError<D extends unknown[] = []> extends Error {
  public readonly statusCode: ErrorStatusCode;
  public readonly isOperational: boolean;
  public readonly details: D;
  public readonly code: string;

  constructor({ message, statusCode, code, details, isOperational, cause }: AppErrorConst<D>) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational ?? true;
    this.details = details ?? ([] as unknown as D);
    this.code = code;
  }
}
