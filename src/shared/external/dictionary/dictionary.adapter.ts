import { setSensesCache, getSensesCache } from "./dictionary.cache";
import { fetchDictionaryEntry } from "./dictionary.client";
import { fetchSensesSchema } from "./dictionary.validator";
import { WordSenseShape } from "@/shared/types/shapes/word.shape";

const inflightRequests = new Map<string, Promise<Map<string, WordSenseShape[]>>>();

const getSenses = async (word: string): Promise<Map<string, WordSenseShape[]>> => {
  const sensesFromCache = await getSensesCache(word);

  if (sensesFromCache) {
    return new Map(Object.entries(sensesFromCache));
  }

  if (inflightRequests.has(word)) {
    return await inflightRequests.get(word)!;
  }

  try {
    const newPromise = async (): Promise<Map<string, WordSenseShape[]>> => {
      const wordEntry = await fetchDictionaryEntry(word);

      const parsedData = fetchSensesSchema.parse(wordEntry);

      const mappedData = parsedData.entries.reduce(
        (acc: Map<string, WordSenseShape[]>, curr) =>
          acc.set(curr.partOfSpeech, [...(acc.get(curr.partOfSpeech) || []), ...curr.senses]),
        new Map<string, WordSenseShape[]>(),
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
