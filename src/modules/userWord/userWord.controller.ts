import { sendSuccessResponse } from "@/shared/helpers/response.helper";
import { HTTP_STATUS } from "@/shared/constants/httpStatus.const";
import { userWordService } from "./userWord.service";
import { Create, Remove, Update } from "@/shared/types/controllers/userWord.controller.type";

const create: Create = async (req, res) => {
  const { wordId, status, note, isFavorite } = res.locals.validatedData.body;
  const { userId } = res.locals.user;

  const userWord = await userWordService.create({ wordId, userId, status, note, isFavorite });

  sendSuccessResponse(res, HTTP_STATUS.CREATED, "Word was successfully saved!", userWord);
};

const remove: Remove = async (req, res) => {
  const { wordId } = res.locals.validatedData.params;
  const { userId } = res.locals.user;

  await userWordService.remove({ wordId, userId });

  sendSuccessResponse(res, HTTP_STATUS.OK, "Word was successfully removed!", { wordId });
};

const update: Update = async (req, res) => {
  const input = res.locals.validatedData.body;
  const { wordId } = res.locals.validatedData.params;
  const { userId } = res.locals.user;

  const updatedUserWord = await userWordService.update({ wordId, userId, ...input });

  sendSuccessResponse(res, HTTP_STATUS.OK, "Word is successfully updated!", { updatedUserWord });
};

export const userWordController = {
  create,
  remove,
  update,
};
