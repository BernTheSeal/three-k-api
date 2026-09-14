import { wordConfig } from "@/shared/config/word.config";
import { cacheProvider } from "@/shared/lib/cache/cache.provider";
import { keyBuilder } from "@/shared/utils/cache.util";
import { WordDetailShape } from "@/shared/types/shapes/word.shape";

const NAMESPACE = wordConfig.cache.detail.namespace;
const VERSION = wordConfig.cache.detail.version;
const TTL = wordConfig.cache.detail.ttlSec;
const HASH_KEY = wordConfig.cache.all.key;

const setWordCache = async (word: string, value: WordDetailShape): Promise<void> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  await cacheProvider.set(key, value, TTL);
};

const getWordCache = async (word: string): Promise<WordDetailShape | null> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  const value = await cacheProvider.get(key);
  return value !== null ? (value as WordDetailShape) : null;
};

const setAllWordsCache = async (words: Record<string, number>) => {
  await cacheProvider.setHash(HASH_KEY, words);
};

const getWordsLen = async (): Promise<number> => {
  return await cacheProvider.hashLen(HASH_KEY);
};

const getWordIndexMany = async (lemmas: string[]): Promise<(number | null)[]> => {
  const results = await cacheProvider.getHashMany(HASH_KEY, lemmas);
  return results.map((value) => (value !== null ? Number(value) : null));
};

export { setWordCache, getWordCache, setAllWordsCache, getWordsLen, getWordIndexMany };
