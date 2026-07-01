import { Router } from "express";
import { authRouter } from "./auth.route";
import { wordRouter } from "./word.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/word", wordRouter);

export { router };
