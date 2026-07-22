import { GetWordInput } from "@/modules/word/word.validator";

type ListInput = {
  filters: GetWordInput;
  paginate?: {
    offset?: number;
    limit?: number;
  };
  user_id: number;
};

type ListResponse = {
  paginate: {
    hasMore: boolean;
    nextOffset: number;
  };
  total: number;
  words: {
    word_id: number;
    word: string;
    pos: string[];
    levels: string[];
    is_favorite: boolean | null;
    status: "known" | "learning" | null;
  }[];
};

type FindByWordInput = {
  word: string;
  user_id: number;
};

type FindByWordResponse = {
  word_id: number;
  word: string;
  phonetics: {
    locale: "us" | "uk";
    text: string;
    mp3: `${string}.mp3`;
  }[];
  userInfo: {
    status: "known" | "learning" | null;
    note: string | null;
    isFavorite: boolean | null;
  };
  entries: {
    partOfSpeech: string;
    level: string;
  }[];
};

type FindByWordWithSensesInput = FindByWordInput;

type FindByWordWithSensesResponse = {
  word_id: number;
  word: string;
  phonetics: {
    locale: "us" | "uk";
    text: string;
    mp3: `${string}.mp3`;
  }[];
  userInfo: {
    status: "known" | "learning" | null;
    note: string | null;
    isFavorite: boolean | null;
  };
  entries: {
    partOfSpeech: string;
    level: string;
    senses: {
      definition: string;
      examples: string[];
    }[];
  }[];
};

export type WordService = {
  list: (data: ListInput) => Promise<ListResponse>;
  findByWord: (data: FindByWordInput) => Promise<FindByWordResponse | null>;
  findByWordWithSenses: (data: FindByWordWithSensesInput) => Promise<FindByWordWithSensesResponse | null>;
};
