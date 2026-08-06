import express from "express";
import { userWordController } from "./userWord.controller";
import { createSchema, removeSchema, updateSchema } from "./userWord.validator";
import { validate } from "@/shared/middlewares/validate";
import { authenticate } from "@/shared/middlewares/authenticate";

const userWordRouter = express.Router();

userWordRouter.post("/", authenticate, validate(createSchema), userWordController.create);
userWordRouter.delete("/:wordId", authenticate, validate(removeSchema), userWordController.remove);
userWordRouter.patch("/:wordId", authenticate, validate(updateSchema), userWordController.update);

export { userWordRouter };
