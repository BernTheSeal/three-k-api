import { AuthHandler } from "./common.controller.type";
import { GetWordByIdDto, GetWordDto } from "@/modules/word/word.validator";

export type Get = AuthHandler<GetWordDto>;
export type GetByWord = AuthHandler<GetWordByIdDto>;
