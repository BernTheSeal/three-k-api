import { POS } from "@/shared/types/entities";

export const ALLOWED_PUNC = new Set([".", ",", "!", "?", '"', ":", ";"]);
export const ALLOWED_POS = new Set<string>(POS);
export const SENTENCE_END = new Set([".", "!", "?"]);
export const CONTRACTIONS = new Set(["n't", "'m", "'re", "'ve", "'ll", "'d"]);
export const ATTACH_PUNC = new Set([".", ",", "!", "?", ":", ";"]);
