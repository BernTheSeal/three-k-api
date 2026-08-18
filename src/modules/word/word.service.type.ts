import { GetWordInput } from "@/modules/word/word.validator";

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

export type List = (input: {
  filters: GetWordInput;
  paginate?: {
    offset?: number;
    limit?: number;
  };
}) => Promise<{
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
}>;

export type FindByWord = (input: { word: string; userId: number }) => Promise<FindByWordResponse | null>;

export type FindByWordWithSenses = (input: { word: string; userId: number }) => Promise<{
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
} | null>;
