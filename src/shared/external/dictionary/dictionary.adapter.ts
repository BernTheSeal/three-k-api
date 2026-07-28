import { setSensesCache, getSensesCache } from "./dictionary.cache";
import { fetchDictionaryEntry } from "./dictionary.client";

import { fetchSensesSchema, Senses } from "./dictionary.validator";

const inflightRequests = new Map<string, Promise<Map<string, Senses[]>>>();

const getSenses = async (word: string): Promise<Map<string, Senses[]>> => {
  const sensesFromCache = await getSensesCache(word);

  if (sensesFromCache) {
    return new Map(Object.entries(sensesFromCache));
  }

  if (inflightRequests.has(word)) {
    return await inflightRequests.get(word)!;
  }

  try {
    const newPromise = async (): Promise<Map<string, Senses[]>> => {
      const wordEntry = await fetchDictionaryEntry(word);

      const parsedData = fetchSensesSchema.parse(wordEntry);

      const mappedData = parsedData.entries.reduce(
        (acc: Map<string, Senses[]>, curr) => acc.set(curr.partOfSpeech, [...(acc.get(curr.partOfSpeech) || []), ...curr.senses]),
        new Map<string, Senses[]>(),
      );

      const dataToObject = Object.fromEntries(mappedData);

      await setSensesCache(word, dataToObject);

      return mappedData;
    };

    const promise = newPromise();

    inflightRequests.set(word, promise);

    return await promise;
  } catch (error) {
    return new Map();
  } finally {
    inflightRequests.delete(word);
  }
};

export const dictionaryAdapter = {
  getSenses,
};
