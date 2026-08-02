import { GetWordInput } from "@/modules/word/word.validator";
import { WordEntity, WordPhoneticEntity, PosEntity, LevelEntity } from "../../types/entities";

import { FindTxOptions } from "./common.repo.type";

export type ListResult = {
  wordId: number;
  word: string;
  pos: string[];
  levels: string[];
  status: "known" | "learning" | null;
  isFavorite: boolean | null;
  totalWords: number;
};

export type List = (
  params: {
    filters: GetWordInput;
    paginate: {
      offset: number;
      limit: number;
    };
  },
  tx?: FindTxOptions,
) => Promise<ListResult[]>;

export type FindByWordResult = WordEntity & Pick<PosEntity, "pos"> & Pick<LevelEntity, "level"> & WordPhoneticEntity;

export type FindByWord = (params: { word: string }, tx?: FindTxOptions) => Promise<FindByWordResult[]>;
