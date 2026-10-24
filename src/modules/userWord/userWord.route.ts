import express from "express";

import { userWordController } from "./userWord.controller";
import { createSchema, removeSchema, updateSchema } from "./userWord.validator";

import { validate, authenticate } from "@/shared/middlewares";

const userWordRouter = express.Router();

userWordRouter.post("/", authenticate, validate(createSchema), userWordController.create);
userWordRouter.delete("/:wordId", authenticate, validate(removeSchema), userWordController.remove);
userWordRouter.patch("/:wordId", authenticate, validate(updateSchema), userWordController.update);

export { userWordRouter };
