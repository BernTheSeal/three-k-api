import { singleflight } from "@/shared/helpers/singleflight.helper";
import { setSensesCache, getSensesCache } from "./dictionary.cache";
import { fetchDictionaryEntry } from "./dictionary.client";
import { fetchSensesSchema } from "./dictionary.validator";
import { WordSenseShape } from "@/shared/types/shapes/word.shape";

const getSenses = async (word: string): Promise<Map<string, WordSenseShape[]>> => {
  const sensesFromCache = await getSensesCache(word);

  if (sensesFromCache) {
    return new Map(Object.entries(sensesFromCache));
  }

  try {
    return await singleflight(`dictionary:${word}`, async () => {
      const wordEntry = await fetchDictionaryEntry(word);

      const parsedData = fetchSensesSchema.parse(wordEntry);

      const mappedData = parsedData.entries.reduce(
        (acc: Map<string, WordSenseShape[]>, curr) =>
          acc.set(curr.partOfSpeech, [...(acc.get(curr.partOfSpeech) || []), ...curr.senses]),
        new Map<string, WordSenseShape[]>(),
      );

      await setSensesCache(word, Object.fromEntries(mappedData));

      return mappedData;
    });
  } catch (error) {
    return new Map();
  }
};

export const dictionaryAdapter = {
  getSenses,
};
