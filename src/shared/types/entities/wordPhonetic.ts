export type WordPhoneticEntity = {
  wordId: number;
  locale: "us" | "uk";
  text: string;
  mp3: `${string}.mp3`;
};
