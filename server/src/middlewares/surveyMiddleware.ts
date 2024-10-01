import { NextFunction, Request, Response } from "express";
import { NewSurvey } from "../types/types";
import {
  newSurveySchema,
  validateWithSchema,
} from "../utils/validations/survey";
import { ZodError } from "zod";
import { CustomError } from "../errors/customError";
export const validateNewSurvey = async (
  // don't make the type of of the id as anumber
  // Express treats all route parameters as string by default, even though you're defining it as number.
  req: Request<{ workspaceId: string }, {}, NewSurvey>,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId;
    if (isNaN(+workspaceId) || +workspaceId < 1) {
      throw new CustomError("invalid workspace ID", 400, true);
    }
    const data = req.body;
    const schema = newSurveySchema();
    schema.parse(data);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(validateWithSchema(error));
    }
    next(error);
  }
};
