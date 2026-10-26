import { posRepo } from "./pos.repo";
import { posCache } from "./pos.cache";
import { GetIdByPosFromCache } from "./pos.service.type";
import { logUtil } from "@/shared/utils/log.util";

const initializePosCache = async () => {
  const posResponse = await posRepo.getAll();
  posCache.set(posResponse);

  logUtil.info(`Pos cache initialized with ${posResponse.length} pos.`);
};

const getIdByPosFromCache: GetIdByPosFromCache = (input) => {
  const { pos } = input;
  return posCache.get(pos);
};

export const posService = {
  initializePosCache,
  getIdByPosFromCache,
};
