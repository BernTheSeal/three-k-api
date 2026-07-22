export type WordPhonetic = {
  word_id: number;
  locale: "us" | "uk";
  text: string;
  mp3: `${string}.mp3`;
};
