// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  sendDevError,
  sendProdError,
} from "../errors/customError";
import sequelize from "sequelize";
import { getTranslation } from "../utils";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";
  if (res.headersSent) {
    return next(err);
  }

  // catching sequelize Errors
  if (
    err.name === "SequelizeValidationError" &&
    err instanceof sequelize.ValidationError
  ) {
    return res.status(400).json({
      status: "error",
      message:
        err.errors[0].message ?? getTranslation(currentLang, "unexpectedError"),
    });
  }
  const isDev = process.env.NODE_ENV === "development";
  isDev ? sendDevError(err, req, res) : sendProdError(err, req, res);
};

export default errorHandler;
