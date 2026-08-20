import { LevelEntity, PosEntity, WordEntity, WordPhoneticEntity } from "../entities";

type WordEntryShape = {
  pos: PosEntity["pos"];
  level: LevelEntity["level"];
};

type WordEntryArrayShape = {
  pos: PosEntity["pos"][];
  level: LevelEntity["level"][];
};

type WordEntryWithSensesShape = WordEntryShape & {
  senses: WordSenseShape[];
};

export type WordSenseShape = {
  definition: string;
  examples: string[];
};

export type WordFilterShape = {
  search?: string;
} & Partial<WordEntryArrayShape>;

export type WordSummaryShape = WordEntity & WordEntryArrayShape;

export type WordDetailShape = WordEntity & {
  phonetics: Omit<WordPhoneticEntity, "wordId">[];
  entries: WordEntryShape[];
};

export type WordDetailWithSenseShape = WordEntity & {
  phonetics: Omit<WordPhoneticEntity, "wordId">[];
  entries: WordEntryWithSensesShape[];
};
