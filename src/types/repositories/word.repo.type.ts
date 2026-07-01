import { GetWordInput } from "../../schemas/validators/word.validator";
import { User, Word } from "../entities";
import { UserWord } from "../entities/userWord";
import { WordPhonetic } from "../entities/wordPhonetic";
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

type findByWordParams = {
  user_id: number;
  word: string;
};

export type findByWordResult = Word & {
  pos: string;
  level: string;
} & WordPhonetic & {
    status: UserWord["status"] | null;
    is_favorite: boolean | null;
    note: string | null;
  };

export type WordRepo = {
  list: (data: ListParams, tx?: FindTxOptions) => Promise<ListResult[]>;

  findByWord: (
    data: findByWordParams,
    tx?: FindTxOptions,
  ) => Promise<findByWordResult[]>;
};
