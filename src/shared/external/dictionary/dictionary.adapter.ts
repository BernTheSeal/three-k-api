import { ExternalServiceError } from "@/shared/errors";
import { fetchDictionaryEntry } from "./dictionary.client";

import { fetchSensesSchema, Senses } from "./dictionary.validator";

export const fetchSenses = async (word: string): Promise<Map<string, Senses[]>> => {
  try {
    const wordEntry = await fetchDictionaryEntry(word);

    const parsedData = fetchSensesSchema.parse(wordEntry);

    const mappedData = parsedData.entries.reduce(
      (acc: Map<string, Senses[]>, curr) => acc.set(curr.partOfSpeech, [...(acc.get(curr.partOfSpeech) || []), ...curr.senses]),
      new Map<string, Senses[]>(),
    );

    return mappedData;
  } catch (err) {
    console.error(err);

    return new Map();
  }
};
