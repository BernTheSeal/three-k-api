import { dictionaryAdapter } from "@/shared/external/dictionary/dictionary.adapter";
import { wordRepo } from "./word.repo";
import { wordCache } from "./word.cache";
import { wordConfig } from "@/shared/config/word.config";
import { getSafeOffset } from "@/shared/utils/pagination.util";

import { List, FindByWord, FindByWordWithSenses } from "./word.service.type";
import { singleflight } from "@/shared/helpers/singleflight.helper";

const initializeWordsCache = async () => {
  const length = await wordCache.getLen();

  if (length > 0) {
    console.log("Words cache already initialized, skipping.");
    return;
  }
  const words = await wordRepo.getAll();

  const wordsObject = words.reduce(
    (acc, curr) => {
      acc[curr.word] = curr.wordId;
      return acc;
    },
    {} as Record<string, number>,
  );

  await wordCache.setAll(wordsObject);

  console.log(`Words cache initialized with ${words.length} words.`);
};

const list: List = async (input) => {
  const { filters, paginate } = input;

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
};

const findByWord: FindByWord = async (input) => {
  const { word } = input;

  const wordFromCache = await wordCache.get(word);

  if (wordFromCache) {
    return wordFromCache;
  }

  return await singleflight(`word:${word}`, async () => {
    const wordResponse = await wordRepo.findByWord({ word });

    const first = wordResponse[0];

    if (!first) {
      return null;
    }

    const wordDetails = {
      wordId: first.wordId,
      word: first.word,
      phonetics: [...new Map(wordResponse.map((w) => [w.locale, { locale: w.locale, text: w.text, mp3: w.mp3 }])).values()],
      entries: [...new Map(wordResponse.map((w) => [w.pos, { pos: w.pos, level: w.level }])).values()],
    };

    await wordCache.set(word, wordDetails);

    return wordDetails;
  });
};

const findByWordWithSenses: FindByWordWithSenses = async (input) => {
  const { word } = input;

  const wordResponse = await findByWord({ word });

  if (!wordResponse) {
    return null;
  }

  const senses = await dictionaryAdapter.getSenses(word);
  const missingPos: string[] = [];

  for (const [key] of senses) {
    const isExists = wordResponse.entries.some((e) => e.pos == key);

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
      senses: senses.get(e.pos) || [],
    })),
  };

  return mergeWordAndSenses;
};

export const wordService = {
  initializeWordsCache,
  list,
  findByWord,
  findByWordWithSenses,
};
