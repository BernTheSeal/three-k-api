import { PosEntity } from "@/shared/types/entities";

const posIndexes = new Map<string, number>();

const set = (posEntry: PosEntity[]) => {
  posEntry.forEach((p) => {
    posIndexes.set(p.pos, p.posId);
  });
};

const get = (pos: string): number | undefined => {
  return posIndexes.get(pos);
};

export const posCache = {
  set,
  get,
};
