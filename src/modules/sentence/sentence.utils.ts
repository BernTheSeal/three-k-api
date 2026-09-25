export const clearSentence = (sentence: string) => {
  return sentence
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-zA-Z'\s]/g, " ")
    .replace(/(?<![a-zA-Z])'|'(?![a-zA-Z])/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
