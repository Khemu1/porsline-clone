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
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
const app = express();
const upload = multer();

dotenv.config();
const __dirname = path.resolve();

const corsOptions = {
  origin: process.env.VITE_ADDRESS,
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

// Handle unmatched routes
app.use("*", (req, res, next) => {
  next(new CustomError("Route not found", 404, true));
});

// Global error handling middleware
app.use(errorHandler);

export default app;
