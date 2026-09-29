import { ExternalServiceError } from "@/shared/errors";
import { lemmatizeConfig } from "@/shared/config/lemmatize.config";
import axios from "axios";
import { lemmatizeResponseSchema } from "./lemmatize.validator";
import { ZodError } from "zod";

export const lemmatizeClient = async (sentence: string) => {
  try {
    const response = await axios.post(lemmatizeConfig.url, { sentence }, { timeout: lemmatizeConfig.timeoutMs });
    const parsedResponse = lemmatizeResponseSchema.parse(response.data.data);
    return parsedResponse;
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ExternalServiceError({
        message: "Lemmatizer returned an unexpected response shape",
        code: "LEMMATIZE_INVALID_RESPONSE",
        service: "LEMMATIZE",
        cause: err,
      });
    }

    const upstreamStatus = axios.isAxiosError(err) ? err.response?.status : undefined;

    throw new ExternalServiceError({
      message: "Lemmatizer service failed",
      code: "LEMMATIZER_UNAVAILABLE",
      service: "LEMMATIZE",
      upstreamStatus,
      cause: err,
    });
  }
};
