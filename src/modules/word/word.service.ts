import { dictionaryAdapter } from "@/shared/external/dictionary/dictionary.adapter";
import { wordRepo } from "./word.repo";
import { WordService } from "@/shared/types/services/word.service.type";
import { getWordCache, setWordCache } from "./word.cache";
import { wordConfig } from "@/shared/config/word.config";
import { getSafeOffset } from "@/shared/utils/pagination.util";

import { FindByWordResponse } from "@/shared/types/services/word.service.type";

const inflightRequests = new Map<string, Promise<FindByWordResponse | null>>();

export const wordService: WordService = {
  async list(data) {
    const { filters, paginate } = data;

    const limit = wordConfig.pagination.limit;

    const safeOffset = getSafeOffset({ limit, offset: paginate?.offset });

    const words = await wordRepo.list({
      filters,
      paginate: {
        limit,
        offset: safeOffset,
      },
    });

    const firstWord = words[0];

    const totalWords = firstWord ? firstWord.totalWords : 0;

    const cleanedWords = words.map(({ totalWords, ...rest }) => rest);

    const hasMore = totalWords > safeOffset + limit;

    const nextOffset = safeOffset + limit;

    return {
      paginate: { hasMore, nextOffset },
      total: totalWords,
      words: cleanedWords,
    };
  },

  async findByWord(data) {
    const { word } = data;

    const wordFromCache = await getWordCache(word);

    if (wordFromCache) {
      return wordFromCache;
    }

    if (inflightRequests.has(word)) {
      return await inflightRequests.get(word)!;
    }

    try {
      const requestPromise = async (): Promise<FindByWordResponse | null> => {
        const wordResponse = await wordRepo.findByWord({ word });

        const first = wordResponse[0];

        if (!first) {
          return null;
        }

        const wordDetails = {
          wordId: first.wordId,
          word: first.word,
          phonetics: [...new Map(wordResponse.map((w) => [w.locale, { locale: w.locale, text: w.text, mp3: w.mp3 }])).values()],
          entries: [...new Map(wordResponse.map((w) => [w.pos, { partOfSpeech: w.pos, level: w.level }])).values()],
        };

        return wordDetails;
      };

      const promise = requestPromise();

      inflightRequests.set(word, promise);

      const res = await promise;

      if (!res) {
        return null;
      }

      await setWordCache(word, res);

      return res;
    } finally {
      inflightRequests.delete(word);
    }
  },

  async findByWordWithSenses(data) {
    const { userId, word } = data;

    const wordResponse = await this.findByWord({ word, userId });

    if (!wordResponse) {
      return null;
    }

    const senses = await dictionaryAdapter.getSenses(word);
    const missingPos: string[] = [];

    for (const [key] of senses) {
      const isExists = wordResponse.entries.some((e) => e.partOfSpeech == key);

      if (!isExists) {
        missingPos.push(key);
      }
    }

    if (missingPos.length > 0) {
      console.warn(`SOME POS ARE MISSING FOR ${word} => ${missingPos.join("-")}`);
    }

    const mergeWordAndSenses = {
      ...wordResponse,
      entries: wordResponse.entries.map((e) => ({
        ...e,
        senses: senses.get(e.partOfSpeech) || [],
      })),
    };

    return mergeWordAndSenses;
  },
};
