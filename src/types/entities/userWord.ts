export type UserWord = {
  user_id: number;
  word_id: number;
  status: "known" | "learning";
  is_favorite: boolean;
  note: string | null;
  created_at: Date;
  updated_at: Date;
};
