import { Router } from "express";

import { getWordByIdSchema, listWordSchema } from "./word.validator";
import { wordController } from "./word.controller";

import { validate, authenticate } from "@/shared/middlewares";

const wordRouter = Router();

wordRouter.get("/", authenticate, validate(listWordSchema), wordController.list);
wordRouter.get("/:word", authenticate, validate(getWordByIdSchema), wordController.getByWord);

export { wordRouter };
