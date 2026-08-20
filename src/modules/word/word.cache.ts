import { wordConfig } from "@/shared/config/word.config";
import { cacheProvider } from "@/shared/lib/cache/cache.provider";
import { keyBuilder } from "@/shared/utils/cache.util";
import { WordDetailShape } from "@/shared/types/shapes/word.shape";

const NAMESPACE = wordConfig.cache.namespace;
const VERSION = wordConfig.cache.version;
const TTL = wordConfig.cache.ttlSec;

const setWordCache = async (word: string, value: WordDetailShape): Promise<void> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  await cacheProvider.set(key, value, TTL);
};

const getWordCache = async (word: string): Promise<WordDetailShape | null> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  const value = await cacheProvider.get(key);
  return value !== null ? (value as WordDetailShape) : null;
};

export { setWordCache, getWordCache };
