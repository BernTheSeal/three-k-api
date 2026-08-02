export type UserWordEntity = {
  userId: number;
  wordId: number;
  status: "known" | "learning";
  isFavorite: boolean;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};
