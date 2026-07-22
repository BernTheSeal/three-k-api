import "dotenv/config";
import { appConfig } from "./shared/config/app.config";
import express from "express";
import cookieParser from "cookie-parser";

import { globalErrorHandler } from "./shared/middlewares/globalErrorHandler";
import { dbErrorHandler } from "./shared/middlewares/dbErrorHandler";
import apiRouter from "./api.router";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(dbErrorHandler);
app.use(globalErrorHandler);

app.listen(appConfig.port, () => console.log(`Server running on port ${appConfig.port}`));
