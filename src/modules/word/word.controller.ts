import { wordService } from "./word.service";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { List, GetByWord } from "./word.dto";
import { sendSuccessResponse } from "@/shared/helpers/response.helper";

const list: List = async (req, res) => {
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

  const wordDetails = await wordService.findByWordWithSenses({
    word,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, "word successfully fetched.", wordDetails);
};

export const wordController = {
  list,
  getByWord,
};
