import { Create } from "./sentence.dto";
import { sendSuccessResponse } from "@/shared/helpers/response.helper";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { sentenceService } from "./sentence.service";

const create: Create = async (req, res) => {
  const { sentence } = res.locals.validatedData.body;
  const { userId } = res.locals.user;

  const createdSentence = await sentenceService.create({ userId, content: sentence });

  sendSuccessResponse(res, HTTP_STATUS.CREATED, "Sentence was successfully created!", createdSentence);
};

export const sentenceController = {
  create,
};
