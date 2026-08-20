import { WordEntity, PosEntity, LevelEntity, WordPhoneticEntity } from "../entities";

export type WordSummaryEnriched = WordEntity & { pos: PosEntity["pos"][]; level: LevelEntity["level"][]; totalWords: number };
export type WordDetailEnriched = WordEntity & Pick<PosEntity, "pos"> & Pick<LevelEntity, "level"> & WordPhoneticEntity;
