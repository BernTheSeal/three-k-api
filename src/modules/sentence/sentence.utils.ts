export const clearSentence = (sentence: string) => {
  return sentence
    .toLowerCase()
    .replace(/[.,!?":;]|(?<![a-z])'|'(?![a-z])/g, " $& ")
    .replace(/\s+/g, " ")
    .trim();
};
