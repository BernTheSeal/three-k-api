import { POS } from "@/shared/types/entities";

const ALLOWED_PUNC = new Set([".", ",", "!", "?", '"', ":", ";"]);
const ALLOWED_POS = new Set<string>(POS);
const SENTENCE_END = new Set([".", "!", "?"]);
const CONTRACTIONS = new Set(["n't", "'m", "'re", "'ve", "'ll", "'d"]);
const ATTACH_PUNC = new Set([".", ",", "!", "?", ":", ";"]);

export const SENTENCE_CONST = {
  ALLOWED_PUNC,
  ALLOWED_POS,
  SENTENCE_END,
  CONTRACTIONS,
  ATTACH_PUNC,
};
