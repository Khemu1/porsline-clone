import { NextFunction, Request, Response } from "express";
import { NewWorkSpace } from "../types/types";
import {
  newWorkSpcaeSchema,
  validateWithSchema,
} from "../utils/validations/workspace";
import { ZodError } from "zod";
export const validateNewWorkSpace = async (
  req: Request<{}, {}, NewWorkSpace>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const schema = newWorkSpcaeSchema();
    schema.parse(data);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(validateWithSchema(error));
    }
    next(error);
  }
};
