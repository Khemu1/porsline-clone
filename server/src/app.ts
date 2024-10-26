// src/app.ts

import express from "express";
import morgan from "morgan";
import authRouter from "./routes/authRouter";
import errorHandler from "./middlewares/errorHandler"; // Import your error handler
import { CustomError } from "./errors/customError";
import cookieParser from "cookie-parser";
import groupRouter from "./routes/groupRouter";
import workspaceRouter from "./routes/workspaceRouter";
import surveyRouter from "./routes/surveyRouter";
import welcomePartRouter from "./routes/welcomePartRouter";
import multer from "multer";
import genericTextRouter from "./routes/genericTextRouter";
import endingsRouter from "./routes/endingsRouter";
import surveyPreviewRouter from "./routes/surveyPreviewRouter";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const upload = multer();

dotenv.config();
const __dirname = path.resolve();

const corsOptions = {
  origin: ["http://localhost:3000", process.env.VITE_ADDRESS as string],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(upload.fields([]));
app.use("/auth", authRouter);
app.use("/group", groupRouter);
app.use("/workspace", workspaceRouter);
app.use("/survey", surveyRouter);
app.use("/welcomepart/", welcomePartRouter);
app.use("/question", genericTextRouter);
app.use("/ending", endingsRouter);
app.use("/preview-survey", surveyPreviewRouter);

app.use("*", (req, res, next) => {
  next(new CustomError("Route not found", 404, true));
});

app.use(errorHandler);

export default app;
