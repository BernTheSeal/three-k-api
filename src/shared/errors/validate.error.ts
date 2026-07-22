import { AppError } from "./app.error";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type ValidateDetails = {
  message: string;
  path: string;
  location: "body" | "query" | "params";
};

export class ValidateError extends AppError<ValidateDetails[]> {
  constructor(message: string, code: string, details: ValidateDetails[]) {
    super(message, HTTP_STATUS.BAD_REQUEST, code, details);
  }
}
