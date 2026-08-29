import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import apiRouter from "./api.router";
import { appConfig } from "@/shared/config/app.config";
import { globalErrorHandler } from "@/shared/middlewares/globalErrorHandler";
import { wordService } from "@/modules/word";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(globalErrorHandler);

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION ERROR:::", reason);
  process.exit(1);
});

const bootstrap = async () => {
  await wordService.initializeWordsCache();
  app.listen(appConfig.port, () => console.log(`Server running on port ${appConfig.port}`));
};

bootstrap().catch((err) => {
  console.error("BOOTSTRAP ERROR:::", err);
  process.exit(1);
});
