import { wordService } from "./word.service";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { WordController } from "@/shared/types/controllers/word.controller.type";
import { sendSuccessResponse } from "@/shared/helpers/response.helper";

export const wordController: WordController = {
  async get(req, res) {
    const { offset, ...filters } = res.locals.validated_data.query;

    const { words, total, paginate } = await wordService.list({
      filters,
      paginate: {
        offset,
      },
    });

    sendSuccessResponse(res, HTTP_STATUS.OK, "words successfully fetched.", { total, paginate, words });
  },

  async getByWord(req, res) {
    const { word } = res.locals.validated_data.params;
    const { user_id } = res.locals.user;

    const wordDetails = await wordService.findByWordWithSenses({
      word,
      user_id,
    });

    sendSuccessResponse(res, HTTP_STATUS.OK, "word successfully fetched.", wordDetails);
  },
};
