import { cacheProvider } from "@/shared/lib/cache/cache.provider";
import { Senses } from "./dictionary.validator";
import { dictionaryConfig } from "@/shared/config/dictionary.config";
import { keyBuilder } from "@/shared/utils/cache.util";

const NAMESPACE = dictionaryConfig.cache.namespace;
const VERSION = dictionaryConfig.cache.version;
const TTL = dictionaryConfig.cache.ttlSec;

export const setSensesCache = async (word: string, value: Record<string, Senses[]>): Promise<void> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  await cacheProvider.set(key, value, TTL);
};

export const getSensesCache = async (word: string): Promise<Record<string, Senses[]> | null> => {
  const key = keyBuilder(NAMESPACE, VERSION, word);
  const value = await cacheProvider.get(key);
  return value !== null ? (value as Record<string, Senses[]>) : null;
};
