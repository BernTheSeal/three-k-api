import axios from "axios";
import { ExternalServiceError, InternalServerError } from "@/shared/errors";
import { HTTP_STATUS } from "../constants/httpStatus.const";

type RetryRequestOptions = {
  service: "DICTIONARY";
  url: string;
  maxAttempt: number;
  retryDelayMs: number;
  timeoutMs: number;
  shouldRetry: (statusCode: number | undefined) => boolean;
};

export const retryRequest = async <T>({
  service,
  url,
  maxAttempt,
  retryDelayMs,
  timeoutMs,
  shouldRetry,
}: RetryRequestOptions): Promise<T> => {
  if (maxAttempt <= 0) {
    throw new InternalServerError({
      message: "Max attempt must be at least 1",
      code: "INVALID_MAX_ATTEMPT",
    });
  }

  for (let attempt = 1; attempt <= maxAttempt; attempt++) {
    try {
      const res = await axios.get(url, { timeout: timeoutMs });
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const statusCode = err.response?.status;

        if (shouldRetry(statusCode) && attempt < maxAttempt) {
          await new Promise((res) => setTimeout(res, retryDelayMs * attempt));
          continue;
        }
      }

      throw new ExternalServiceError({
        message: `${service} service failed!`,
        statusCode: HTTP_STATUS.BAD_GATEWAY,
        service,
        cause: err,
      });
    }
  }

  throw new InternalServerError({
    message: `Retry loop exited unexpectedly (maxAttempt=${maxAttempt})`,
    code: "UNREACHABLE_LOOP_EXIT",
  });
};
