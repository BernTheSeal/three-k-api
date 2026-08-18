import { GetWordByIdDto, GetWordDto } from "@/modules/word/word.validator";
import { AuthHandler } from "@/shared/types/requestHandler.type";

export type Get = AuthHandler<GetWordDto>;
export type GetByWord = AuthHandler<GetWordByIdDto>;
