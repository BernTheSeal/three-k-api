import { Router } from "express";
import { validate } from "../middlewares/validate";
import { isAuth } from "../middlewares/isAuth";
import {
  getWordByIdSchema,
  getWordsSchema,
} from "../schemas/validators/word.validator";
import { wordController } from "../controllers/word.controller";

const wordRouter = Router();

wordRouter.get("/", isAuth, validate(getWordsSchema), wordController.get);
wordRouter.get(
  "/:word",
  isAuth,
  validate(getWordByIdSchema),
  wordController.getByWord,
);

export { wordRouter };
