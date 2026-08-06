import { Create, Remove, Update } from "@/shared/types/services/userWord.service.type";
import { userWordRepo } from "./userWord.repo";
import { NotFoundError } from "@/shared/errors";

const create: Create = async (input) => {
  return userWordRepo.create(input);
};

const remove: Remove = async (input) => {
  const removedUserWord = await userWordRepo.remove(input);

  if (!removedUserWord) {
    throw new NotFoundError("This word is not in your saved list.", "USER_WORD_NOT_FOUND");
  }

  return removedUserWord;
};

const update: Update = async (input) => {
  const updatedUserWord = await userWordRepo.update(input);

  if (!updatedUserWord) {
    throw new NotFoundError("The word is not in your saved list.", "USER_WORD_NOT_FOUND");
  }

  return updatedUserWord;
};

export const userWordService = {
  create,
  remove,
  update,
};
