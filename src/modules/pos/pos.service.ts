import { posRepo } from "./pos.repo";
import { posCache } from "./pos.cache";

const initializePosCache = async () => {
  const posResponse = await posRepo.getAll();
  posCache.set(posResponse);

  console.log(`Pos cache initialized with ${posResponse.length} pos.`);
};

export const posService = {
  initializePosCache,
};
