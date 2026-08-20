import { GetWordByIdDto, ListWordDto } from "@/modules/word/word.validator";
import { AuthHandler } from "@/shared/types/requestHandler.type";

export type List = AuthHandler<ListWordDto>;
export type GetByWord = AuthHandler<GetWordByIdDto>;
