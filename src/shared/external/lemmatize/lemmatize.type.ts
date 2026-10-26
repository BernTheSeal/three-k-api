import { Pos } from "@/shared/types/entities";

type ExtraPos = "proper noun" | "symbol" | "other";

export type LemmatizePos = Pos | ExtraPos;

export type LemmatizeShape = {
  lemma: string;
  surfaceForm: string;
  pos: LemmatizePos;
};
