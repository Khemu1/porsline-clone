// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  sendDevError,
  sendProdError,
} from "../errors/customError";
import sequelize from "sequelize";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    // Delegate to default Express error handler if headers are already sent
    return next(err);
  }

  // catching sequelize Errors
  if (err.name === "SequelizeValidationError" && err instanceof sequelize.ValidationError) {
    return res.status(400).json({
      status: "error",
      message: err.errors[0].message,
    });
  }
  const isDev = process.env.NODE_ENV === "development";
  isDev ? sendDevError(err, req, res) : sendProdError(err, req, res);
};

export default errorHandler;
