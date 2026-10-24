import express from "express";

import { createSchema } from "./sentence.validator";
import { sentenceController } from "./sentence.controller";

import { authenticate, validate } from "@/shared/middlewares";

const sentenceRouter = express.Router();

sentenceRouter.post("/", authenticate, validate(createSchema), sentenceController.create);

export { sentenceRouter };
