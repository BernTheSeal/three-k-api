import { wordConfig } from "@/shared/config/word.config";
import { cacheProvider } from "@/shared/lib/cache/cache.provider";
import { keyBuilder } from "@/shared/utils/cache.util";

type WordCache = {
  wordId: number;
  word: string;
  phonetics: {
    locale: "us" | "uk";
    text: string;
    mp3: `${string}.mp3`;
  }[];
  entries: {
    partOfSpeech: string;
    level: string;
  }[];
};

const NAMESPACE = wordConfig.cache.namespace;
const VERSION = wordConfig.cache.version;
const TTL = wordConfig.cache.ttlSec;

const setWordCache = async (word: string, value: WordCache): Promise<void> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  await cacheProvider.set(key, value, TTL);
};

const getWordCache = async (word: string): Promise<WordCache | null> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  const value = await cacheProvider.get(key);
  return value !== null ? (value as WordCache) : null;
};

export { setWordCache, getWordCache };
