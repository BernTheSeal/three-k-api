import { HTTP_STATUS } from "../constants/httpStatus";
import { wordRepo } from "../repositories/word.repo";
import { WordController } from "../types/controllers/word.controller.type";
import { sendSuccessResponse } from "../utils/response";

import { wordService } from "../services/word.service";

export const wordController: WordController = {
  async get(req, res) {
    const { offset, ...filters } = res.locals.validated_data.query;
    const user = res.locals.user;

    const { words, total, paginate } = await wordService.list({
      filters,
      paginate: {
        offset,
      },
      user_id: user.user_id,
    });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "words successfully fetched.",
      { total, paginate, words },
    );
  },

  async getByWord(req, res) {
    const { word } = res.locals.validated_data.params;
    const { user_id } = res.locals.user;

    const wordDetails = await wordService.findByWordWithSenses({
      word,
      user_id,
    });

    sendSuccessResponse(
      res,
      HTTP_STATUS.success.OK,
      "word successfully fetched.",
      wordDetails,
    );
  },
};
