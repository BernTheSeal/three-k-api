import { GetWordInput } from "@/modules/word/word.validator";
import { Word, UserWord, WordPhonetic } from "../../types/entities";

import { FindTxOptions } from "./common.repo.type";

type ListParams = {
  filters: GetWordInput;
  paginate: {
    offset: number;
    limit: number;
  };
  user_id: number;
};

export type ListResult = {
  word_id: number;
  word: string;
  pos: string[];
  levels: string[];
  status: "known" | "learning" | null;
  is_favorite: boolean | null;
  total_words: number;
};

type FindByWordParams = {
  user_id: number;
  word: string;
};

export type FindByWordResult = Word & {
  pos: string;
  level: string;
} & WordPhonetic & {
    status: UserWord["status"] | null;
    is_favorite: boolean | null;
    note: string | null;
  };

export type WordRepo = {
  list: (data: ListParams, tx?: FindTxOptions) => Promise<ListResult[]>;

  findByWord: (data: FindByWordParams, tx?: FindTxOptions) => Promise<FindByWordResult[]>;
};
