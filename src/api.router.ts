import { Router } from "express";

import { authRouter } from "./modules/auth/auth.router";
import { wordRouter } from "./modules/word/word.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/word", wordRouter);

export default apiRouter;
