import { AuthHandler } from "./common.controller.type";

import { GetWordByIdDto, GetWordDto } from "@/modules/word/word.validator";

export type WordController = {
  get: AuthHandler<GetWordDto>;
  getByWord: AuthHandler<GetWordByIdDto>;
};
