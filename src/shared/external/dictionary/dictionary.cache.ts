import { cacheProvider } from "@/shared/lib/cache/cache.provider";
import { dictionaryConfig } from "@/shared/config/dictionary.config";
import { keyBuilder } from "@/shared/utils/cache.util";
import { WordSenseShape } from "@/shared/types/shapes/word.shape";

const NAMESPACE = dictionaryConfig.cache.namespace;
const VERSION = dictionaryConfig.cache.version;
const TTL = dictionaryConfig.cache.ttlSec;

export const setSensesCache = async (word: string, value: Record<string, WordSenseShape[]>): Promise<void> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  await cacheProvider.set(key, value, TTL);
};

export const getSensesCache = async (word: string): Promise<Record<string, WordSenseShape[]> | null> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  const value = await cacheProvider.get(key);
  return value !== null ? (value as Record<string, WordSenseShape[]>) : null;
};
