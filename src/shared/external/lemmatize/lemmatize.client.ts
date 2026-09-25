import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
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
    throw new ExternalServiceError({
      message: "Lemmatize service failed!",
      statusCode: HTTP_STATUS.BAD_GATEWAY,
      service: "LEMMATIZE",
      cause: err,
    });
  }
};
