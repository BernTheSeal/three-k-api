import { AuthHandler } from "./common.controller.type";

import {
  GetWordByIdDto,
  GetWordDto,
} from "../../schemas/validators/word.validator";

export type WordController = {
  get: AuthHandler<GetWordDto>;
  getByWord: AuthHandler<GetWordByIdDto>;
};
