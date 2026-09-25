import { ExternalServiceError } from "@/shared/errors";
import { lemmatizeConfig } from "@/shared/config/lemmatize.config";
import axios from "axios";

type LemmatizeResponse = {
  lemma: string;
  pos: string;
  text: string;
};

export const lemmatizeClient = async (sentence: string): Promise<LemmatizeResponse[]> => {
  try {
    const response = await axios.post(lemmatizeConfig.url, { sentence }, { timeout: lemmatizeConfig.timeoutMs });
    return response.data.data;
  } catch (err) {
    let statusCode: number | undefined = undefined;

    if (axios.isAxiosError(err)) {
      statusCode = err.response?.status;
    }

    throw new ExternalServiceError({
      message: "Lemmatizer service failed",
      code: "LEMMATIZER_UNAVAILABLE",
      service: "LEMMATIZE",
      upstreamStatus: statusCode,
      cause: err,
    });
  }
};
