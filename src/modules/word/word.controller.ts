import { wordService } from "./word.service";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { Get, GetByWord } from "./word.dto";
import { sendSuccessResponse } from "@/shared/helpers/response.helper";

const get: Get = async (req, res) => {
  const { offset, ...filters } = res.locals.validatedData.query;

  const { words, total, paginate } = await wordService.list({
    filters,
    paginate: {
      offset,
    },
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, "words successfully fetched.", { total, paginate, words });
};

const getByWord: GetByWord = async (req, res) => {
  const { word } = res.locals.validatedData.params;
  const { userId } = res.locals.user;

  const wordDetails = await wordService.findByWordWithSenses({
    word,
    userId,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, "word successfully fetched.", wordDetails);
};

export const wordController = {
  get,
  getByWord,
};
