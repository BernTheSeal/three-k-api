import { GetWordInput } from "@/modules/word/word.validator";

type ListInput = {
  filters: GetWordInput;
  paginate?: {
    offset?: number;
    limit?: number;
  };
};

type ListResponse = {
  paginate: {
    hasMore: boolean;
    nextOffset: number;
  };
  total: number;
  words: {
    wordId: number;
    word: string;
    pos: string[];
    levels: string[];
    isFavorite: boolean | null;
    status: "known" | "learning" | null;
  }[];
};

type FindByWordInput = {
  word: string;
  userId: number;
};

export type FindByWordResponse = {
  wordId: number;
  word: string;
  phonetics: {
    locale: "us" | "uk";
    text: string;
    mp3: `${string}.mp3`;
  }[];
  entries: {
    partOfSpeech: string;
    level: string;
  }[];
};

type FindByWordWithSensesInput = FindByWordInput;

type FindByWordWithSensesResponse = {
  wordId: number;
  word: string;
  phonetics: {
    locale: "us" | "uk";
    text: string;
    mp3: `${string}.mp3`;
  }[];
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
