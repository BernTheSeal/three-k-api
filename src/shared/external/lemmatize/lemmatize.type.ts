import { PosEntity } from "@/shared/types/entities";

type ExtraPos = "proper noun";
export type PosFromEntityWithExtra = PosEntity["pos"] | ExtraPos;

export type LemmatizeEntity = {
  lemma: string;
  pos: PosFromEntityWithExtra;
};
