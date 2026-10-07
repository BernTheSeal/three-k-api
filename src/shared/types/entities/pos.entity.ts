export const POS_NAMES = [
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
] as const;

type PosName = (typeof POS_NAMES)[number];

export type PosEntity = {
  posId: number;
  pos: PosName;
};
