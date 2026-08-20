import { Router } from "express";
import { validate } from "../../shared/middlewares/validate";
import { authenticate } from "../../shared/middlewares/authenticate";
import { getWordByIdSchema, listWordSchema } from "./word.validator";
import { wordController } from "./word.controller";

const wordRouter = Router();

wordRouter.get("/", authenticate, validate(listWordSchema), wordController.list);
wordRouter.get("/:word", authenticate, validate(getWordByIdSchema), wordController.getByWord);

export { wordRouter };
