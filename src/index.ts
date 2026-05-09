import "dotenv/config";
import { env } from "./config/env";
import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { dbErrorHandler } from "./middlewares/dbErrorHandler";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

app.use(dbErrorHandler);
app.use(globalErrorHandler);

app.listen(env.port, () => console.log(`Server running on port ${env.port}`));
