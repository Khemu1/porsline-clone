import { NextFunction, Request, Response } from "express";
import { NewSurvey, SurveyModel } from "../types/types";
import {
  newSurveySchema,
  updateUrlSchema,
  validateWithSchema,
} from "../utils/validations/survey";
import { ZodError } from "zod";
import { CustomError } from "../errors/customError";
import Survey from "../db/models/Survey";
import WorkSpace from "../db/models/WorkSpace";

export const validateNewSurvey = async (
  req: Request<{ workspaceId: string }, {}, NewSurvey>,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId;
    if (Number.isNaN(+workspaceId) || +workspaceId < 1) {
      throw new CustomError(
        "Invalid workspace ID",
        400,
        true,
        "invalidWorkspaceId"
      );
    }

    const data = req.body;
    const schema = newSurveySchema(); // assuming this is your Zod schema
    schema.parse(data); // Validates the survey data

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(validateWithSchema(error));
    }
    next(error); // Pass other errors to the error handler
  }
};

export const checkSurveyExists = async (
  req: Request<{ surveyId: string }, { isActive: boolean; title: string }>,
  res: Response<{}, { workspaceId: string; groupId: string }>,
  next: NextFunction
) => {
  const { surveyId } = req.params;
  const { workspaceId } = req.body;
  const { groupId } = res.locals;

  if (isNaN(+workspaceId)) {
    return next(
      new CustomError("Invalid workspace ID", 400, true, "workspaceNotFound")
    );
  }

  const workspace = await WorkSpace.findOne({
    where: { id: workspaceId, groupId: +groupId },
  });

  if (!workspace) {
    return next(
      new CustomError("Workspace not found", 404, true, "workspaceNotFound")
    );
  }

  if (Number.isNaN(+surveyId)) {
    return next(
      new CustomError("Invalid survey ID", 400, true, "invalidSurveyId")
    );
  }

  const survey = await Survey.findOne({
    where: { id: surveyId, workspace: workspaceId },
  });

  if (!survey) {
    return next(
      new CustomError("Survey not found", 404, true, "surveyNotFound")
    );
  }

  next();
};

export const checkDuplicateSurveyTitle = async (
  req: Request<
    { surveyId: string },
    {},
    { title: string; workspaceId: string }
  >,
  res: Response<{}, { workspaceId: string }>,
  next: NextFunction
) => {
  const { title } = req.body;
  const workspaceId = res.locals.workspaceId;

  if (!title || title.trim().length === 0) {
    return next(
      new CustomError("Survey title is required", 400, true, "titleRequired")
    );
  }

  const existingSurvey = await Survey.findOne({
    where: { title, workspace: workspaceId },
  });

  if (existingSurvey) {
    return next(
      new CustomError(
        "Survey with this title already exists",
        409,
        true,
        "titleExists"
      )
    );
  }

  next();
};

export const checkDuplicateSurveyUrl = async (
  req: Request,
  res: Response<{}, { workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { url } = req.body;
    if (!url) {
      return next(
        new CustomError("Survey URL is required", 400, true, "urlRequired")
      );
    }
    updateUrlSchema().parse(url);

    const existingSurvey = await Survey.findOne({
      where: { url },
    });

    if (existingSurvey) {
      return next(
        new CustomError(
          "Survey with this URL already exists",
          409,
          true,
          "urlExists"
        )
      );
    }

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      throw new CustomError(
        "somthing happened while validating the url",
        400,
        true,
        "invalidUrl",
        "",
        validateWithSchema(error)
      );
    }
    throw error;
  }
};
