import { setSensesCache, getSensesCache } from "./dictionary.cache";
import { fetchDictionaryEntry } from "./dictionary.client";

import { fetchSensesSchema, Senses } from "./dictionary.validator";

const getSenses = async (word: string): Promise<Map<string, Senses[]>> => {
  try {
    const sensesFromCache = await getSensesCache(word);

    if (sensesFromCache) {
      return new Map(Object.entries(sensesFromCache));
    }

    const wordEntry = await fetchDictionaryEntry(word);

    const parsedData = fetchSensesSchema.parse(wordEntry);

    const mappedData = parsedData.entries.reduce(
      (acc: Map<string, Senses[]>, curr) => acc.set(curr.partOfSpeech, [...(acc.get(curr.partOfSpeech) || []), ...curr.senses]),
      new Map<string, Senses[]>(),
    );

    const dataToObject = Object.fromEntries(mappedData);

    await setSensesCache(word, dataToObject);

    return mappedData;
  } catch (err) {
    console.error(err);

    return new Map();
  }
};

export const dictionaryAdapter = {
  getSenses,
};
