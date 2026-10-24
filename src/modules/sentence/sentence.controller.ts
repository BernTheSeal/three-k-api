import { Create } from "./sentence.dto";
import { sentenceService } from "./sentence.service";

import { responseHelper } from "@/shared/helpers/response.helper";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";

const create: Create = async (req, res) => {
  const { sentence } = res.locals.validatedData.body;
  const { userId } = res.locals.user;

  const createdSentence = await sentenceService.create({ userId, sentence });

  responseHelper.sendSuccess(res, HTTP_STATUS.CREATED, "Sentence was successfully created!", createdSentence);
};

export const sentenceController = {
  create,
};
