import { PosEntity } from "@/shared/types/entities";
import { PosFromEntityWithExtra } from "./lemmatize.type";

export const EXPECTED_POS_FROM_NLP = [
  "ADP",
  "PRON",
  "VERB",
  "SCONJ",
  "CCONJ",
  "DET",
  "ADJ",
  "ADV",
  "NOUN",
  "AUX",
  "INTJ",
  "NUM",
  "PART",
  "PROPN",
] as const;

export const NLP_POS_TO_DB_POS: Record<(typeof EXPECTED_POS_FROM_NLP)[number], PosFromEntityWithExtra> = {
  ADP: "preposition",
  PRON: "pronoun",
  VERB: "verb",
  SCONJ: "conjunction",
  CCONJ: "conjunction",
  DET: "determiner",
  ADJ: "adjective",
  ADV: "adverb",
  NOUN: "noun",
  AUX: "auxiliary verb",
  INTJ: "exclamation",
  NUM: "number",
  PART: "infinitive marker",
  PROPN: "proper noun",
} as const;

export const UNION_WORDS = new Map<string, { withSuffix?: string; second: string; pos: PosEntity["pos"]; unionForm: string }>([
  ["have", { second: "to", pos: "modal verb", unionForm: "have to" }],
  ["use", { withSuffix: "used", second: "to", pos: "modal verb", unionForm: "used to" }],
  ["used", { second: "to", pos: "modal verb", unionForm: "used to" }],
  ["accord", { withSuffix: "according", second: "to", pos: "preposition", unionForm: "according to" }],
  ["according", { second: "to", pos: "preposition", unionForm: "according to" }],
  ["ice", { second: "cream", pos: "noun", unionForm: "ice cream" }],
  ["no", { second: "one", pos: "pronoun", unionForm: "no one" }],
  ["next", { second: "to", pos: "preposition", unionForm: "next to" }],
  ["all", { second: "right", pos: "adverb", unionForm: "all right" }],
  ["can", { second: "not", pos: "modal verb", unionForm: "cannot" }],
]);

export const CONVERT_DET_TO = new Map<string, Extract<PosEntity["pos"], "indefinite article" | "definite article">>([
  ["a", "indefinite article"],
  ["an", "indefinite article"],
  ["the", "definite article"],
]);

export const MODAL_VERBS = new Set<string>(["should", "could", "must", "need", "may", "might", "would", "will", "can", "ought"]);
