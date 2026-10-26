export type SentenceWordEntity = {
  sentenceId: number;
  wordId: number | null;
  posId: number;
  surfaceForm: string;
  position: number;
  isMergePrev: boolean;
  isCapitalize: boolean;
  isPunc: boolean;
};
