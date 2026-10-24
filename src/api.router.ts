import { Router } from "express";

import { authRouter } from "@/modules/auth";
import { wordRouter } from "@/modules/word";
import { userWordRouter } from "./modules/userWord/userWord.route";
import { sentenceRouter } from "./modules/sentence/sentence.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/word", wordRouter);
apiRouter.use("/user-word", userWordRouter);
apiRouter.use("/sentence", sentenceRouter);

export default apiRouter;
