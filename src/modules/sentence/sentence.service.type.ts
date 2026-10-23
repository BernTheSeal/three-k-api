import { Pos, SentenceEntity, SentenceWordEntity, WordEntity } from "@/shared/types/entities";

type CreateInput = Pick<SentenceEntity, "userId"> & { sentence: string };
type CreateOutput = {
  sentenceId: SentenceWordEntity["sentenceId"];
  words: (Omit<SentenceWordEntity, "sentenceId"> & { word: WordEntity["word"]; pos: Pos })[];
};
export type Create = (input: CreateInput) => Promise<CreateOutput>;
