import { Request, Response } from "express";

// src/errors/customError.ts

export class CustomError extends Error {
  message: string;
  statusCode: number;
  status: string;
  isOperational: boolean;
  type: string;
  details: string = "";
  errors?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number = 500,
    safe: boolean = false,
    type: string = "server error",
    details?: string,
    errors?: Record<string, string>
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode >= 200 && statusCode < 300 ? "success" : "fail";
    this.isOperational = safe;
    this.details = details || "";
    this.type = type;
    this.errors = errors;
    // this.stack = new Error().stack;
  }
}
export const sendDevError = (
  error: CustomError,
  req: Request,
  res: Response
) => {
  const {
    statusCode = 500,
    status = "error",
    message,
    stack,
    type,
    errors,
  } = error;
  res.status(statusCode).json({
    status,
    message,
    type,
    stack,
    details: error.details || {},
    errors,
  });
};

export const sendProdError = (
  error: CustomError,
  req: Request,
  res: Response
) => {
  const {
    statusCode = 500,
    status = "error",
    message,
    isOperational,
    type,
    errors,
  } = error;

  if (isOperational) {
    res.status(statusCode).json({
      status,
      message,
      type,
      errors,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
      errors,
    });
  }
};
