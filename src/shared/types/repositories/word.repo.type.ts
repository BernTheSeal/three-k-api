import { GetWordInput } from "@/modules/word/word.validator";
import { WordEntity, WordPhoneticEntity, PosEntity, LevelEntity } from "../../types/entities";

import { FindTxOptions } from "./common.repo.type";

type ListParams = {
  filters: GetWordInput;
  paginate: {
    offset: number;
    limit: number;
  };
};

export type ListResult = {
  wordId: number;
  word: string;
  pos: string[];
  levels: string[];
  status: "known" | "learning" | null;
  isFavorite: boolean | null;
  totalWords: number;
};

type FindByWordParams = {
  word: string;
};

export type FindByWordResult = WordEntity & Pick<PosEntity, "pos"> & Pick<LevelEntity, "level"> & WordPhoneticEntity;

export type WordRepo = {
  list: (data: ListParams, tx?: FindTxOptions) => Promise<ListResult[]>;

  findByWord: (data: FindByWordParams, tx?: FindTxOptions) => Promise<FindByWordResult[]>;
};
