import { HTTP_STATUS } from "../constants/httpStatus";

export type SuccessStatusCode =
  (typeof HTTP_STATUS.success)[keyof typeof HTTP_STATUS.success];
export type ErrorStatusCode =
  (typeof HTTP_STATUS.error)[keyof typeof HTTP_STATUS.error];
