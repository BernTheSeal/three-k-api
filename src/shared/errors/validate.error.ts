import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type ValidateErrorCosnt = {
  message: string;
  code: string;
  isOperational?: boolean;
  details: Details[];
};

type Details = {
  message: string;
  path: string;
  location: "body" | "query" | "params";
};

export class ValidateError extends AppError<Details[]> {
  constructor({ message, code, isOperational, details }: ValidateErrorCosnt) {
    super({ message, statusCode: HTTP_STATUS.BAD_REQUEST, code, details, isOperational: isOperational ?? true });
  }
}
