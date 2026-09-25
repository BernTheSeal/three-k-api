import express from "express";
import { createSchema } from "./sentence.validator";
import { validate } from "@/shared/middlewares/validate";
import { authenticate } from "@/shared/middlewares/authenticate";
import { sentenceController } from "./sentence.controller";

const sentenceRouter = express.Router();

sentenceRouter.post("/", authenticate, validate(createSchema), sentenceController.create);

export { sentenceRouter };
