import { fetchSenses } from "@/shared/external/dictionary/dictionary.adapter";
import { wordRepo } from "./word.repo";
import { WordService } from "@/shared/types/services/word.service.type";

export const wordService: WordService = {
  async list(data) {
    const { filters, user_id, paginate } = data;

    const LIMIT = 50;
    const OFFSET = paginate?.offset ? paginate.offset : 0;
    const SAFE_OFFSET = Math.floor(OFFSET / LIMIT) * LIMIT;

    const words = await wordRepo.list({
      filters,
      user_id,
      paginate: {
        limit: LIMIT,
        offset: SAFE_OFFSET,
      },
    });

    const firstWord = words[0];
    const total = firstWord ? firstWord.total_words : 0;

    const cleanedWords = words.map(({ total_words, ...rest }) => rest);

    const hasMore = total > SAFE_OFFSET + LIMIT;

    const nextOffset = SAFE_OFFSET + LIMIT;

    return {
      paginate: { hasMore, nextOffset },
      total,
      words: cleanedWords,
    };
  },

  async findByWord(data) {
    const { word, user_id } = data;

    const wordResponse = await wordRepo.findByWord({ user_id, word });

    const first = wordResponse[0];

    if (!first) {
      return null;
    }

    const wordDetails = {
      word_id: first.word_id,
      word: first.word,
      phonetics: [...new Map(wordResponse.map((w) => [w.locale, { locale: w.locale, text: w.text, mp3: w.mp3 }])).values()],
      userInfo: {
        status: first.status,
        isFavorite: first.is_favorite,
        note: first.note,
      },

      entries: [...new Map(wordResponse.map((w) => [w.pos, { partOfSpeech: w.pos, level: w.level }])).values()],
    };

    return wordDetails;
  },

  async findByWordWithSenses(data) {
    const { user_id, word } = data;

    const wordResponse = await this.findByWord({ word, user_id });

    if (!wordResponse) {
      return null;
    }

    const senses = await fetchSenses(word);
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
