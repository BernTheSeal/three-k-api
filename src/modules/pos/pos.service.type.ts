type GetIdByPosFromCacheInput = { pos: string };
type GetIdByPosFromCacheOutput = number | null;
export type GetIdByPosFromCache = (input: GetIdByPosFromCacheInput) => GetIdByPosFromCacheOutput;
