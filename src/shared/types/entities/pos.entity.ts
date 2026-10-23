export const POS = [
  "verb",
  "noun",
  "adjective",
  "adverb",
  "conjunction",
  "preposition",
  "auxiliary verb",
  "determiner",
  "pronoun",
  "exclamation",
  "indefinite article",
  "number",
  "modal verb",
  "definite article",
  "infinitive marker",
  "punctuation",
] as const;

export type Pos = (typeof POS)[number];

export const PUNC = "punctuation" satisfies Pos;

export type PosEntity = {
  posId: number;
  pos: Pos;
};
