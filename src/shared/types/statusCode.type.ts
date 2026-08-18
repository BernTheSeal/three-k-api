import { SUCCESS, ERROR } from "../constants/httpStatus.const";

export type SuccessStatusCode = (typeof SUCCESS)[keyof typeof SUCCESS];
export type ErrorStatusCode = (typeof ERROR)[keyof typeof ERROR];
