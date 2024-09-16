import { Request, Response, NextFunction } from "express";

// src/errors/customError.ts
export class CustomError extends Error {
  public statusCode: number;
  public details?: any;
  public status: string;
  public isOperational: boolean = false; // is a trused error or not

  constructor(
    message: string,
    statusCode: number,
    isOpertional: boolean,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "CustomError";
    this.status = Math.floor(1000 / statusCode) === 4 ? "fail" : "error";
    this.isOperational = isOpertional;

    // this will tell from where the error generated
    Error.captureStackTrace(this, this.constructor);
  }
}

export const sendDevError = (
  error: CustomError,
  req: Request,
  res: Response
) => {
  const { statusCode = 500, status = "error", message, stack } = error;
  res.status(statusCode).json({
    status,
    message,
    stack,
    error: error.details || {},
  });
};

export const sendProdError = (
  error: CustomError,
  req: Request,
  res: Response
) => {
  const { statusCode = 500, status = "error", message, isOperational } = error;

  if (isOperational) {
    res.status(statusCode).json({
      status,
      message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};