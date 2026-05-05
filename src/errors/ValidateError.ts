import { AppError } from "./AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

type ValidateDetails = {
  message: string;
  path: string;
  location: "body" | "query" | "params";
};

export class ValidateError extends AppError<ValidateDetails[]> {
  constructor(message: string, code: string, details: ValidateDetails[]) {
    super(message, HTTP_STATUS.error.BAD_REQUEST, code, details);
  }
}
