import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import apiRouter from "./api.router";

import { appConfig } from "@/shared/config/app.config";
import { globalErrorHandler } from "@/shared/middlewares";
import { wordService } from "@/modules/word";
import { posService } from "@/modules/pos";
import { logUtil } from "./shared/utils/log.util";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(globalErrorHandler);

process.on("unhandledRejection", (reason) => {
  logUtil.error("Unhandled promise rejection, shutting down.", { tag: "unhandled rejection", payload: reason });
  process.exit(1);
});

const bootstrap = async () => {
  await posService.initializePosCache();
  await wordService.initializeWordsCache();
  app.listen(appConfig.port, () => logUtil.success(`Server running on port ${appConfig.port}`, { tag: "server" }));
};

bootstrap().catch((err) => {
  logUtil.error("Bootstrap failed, server could not start.", { tag: "bootstrap", payload: err });
  process.exit(1);
});
