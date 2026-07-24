import axios from "axios";
import { dictionaryConfig } from "@/shared/config/dictionary.config";
import { ExternalServiceError, InternalServerError } from "@/shared/errors";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

export const fetchDictionaryEntry = async (word: string): Promise<unknown> => {
  for (let attempt = 1; attempt <= dictionaryConfig.maxAttempt; attempt++) {
    try {
      const res = await axios.get(`${dictionaryConfig.url}/entries/en/${word}`, { timeout: dictionaryConfig.timeoutMs });

      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        const shouldRetry = status === undefined || status >= HTTP_STATUS.INTERNAL_SERVER_ERROR || status === HTTP_STATUS.TOO_MANY_REQUESTS;

        if (shouldRetry && attempt < dictionaryConfig.maxAttempt) {
          await new Promise((resolve) => setTimeout(resolve, attempt * dictionaryConfig.retryDelayMs));
          continue;
        }
      }

      throw new ExternalServiceError("Dictionary service failed!", HTTP_STATUS.BAD_GATEWAY, "dictionary", error);
    }
  }

  throw new InternalServerError(
    `fetchDictionaryEntry loop exited without returning (maxAttempt=${dictionaryConfig.maxAttempt})`,
    "UNREACHABLE_LOOP_EXIT",
  );
};
