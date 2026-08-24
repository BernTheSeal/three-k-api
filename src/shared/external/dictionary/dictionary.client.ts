import { dictionaryConfig } from "@/shared/config/dictionary.config";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { retryRequest } from "@/shared/helpers/retryRequest.helper";

export const fetchDictionaryEntry = async (word: string): Promise<unknown> => {
  return await retryRequest({
    service: "DICTIONARY",
    url: `${dictionaryConfig.url}/entries/en/${word}`,
    timeoutMs: dictionaryConfig.timeoutMs,
    maxAttempt: dictionaryConfig.maxAttempt,
    retryDelayMs: dictionaryConfig.retryDelayMs,
    shouldRetry: (statusCode) => {
      return (
        statusCode === undefined ||
        statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR ||
        statusCode === HTTP_STATUS.TOO_MANY_REQUESTS
      );
    },
  });
};
