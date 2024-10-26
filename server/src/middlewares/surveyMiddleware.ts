import { NextFunction, Request, Response } from "express";
import { SurveyModel } from "../types/types";
import {
  newSurveySchema,
  updateUrlSchema,
  validateWithSchema,
} from "../utils/validations/survey";
import { ZodError } from "zod";
import { CustomError } from "../errors/customError";
import Survey from "../db/models/Survey";
import WorkSpace from "../db/models/WorkSpace";
import { Op } from "sequelize";
export const validateNewSurvey = async (
  req: Request<{ surveyId: string }, {}, { title: string }>,
  res: Response<
    {},
    {
      workspaceId: string;
      groupId: string;
      userId: string;
      duplicateSurvey?: SurveyModel;
    }
  >,
  next: NextFunction
) => {
  try {
    const { title } = req.body;
    const schema = newSurveySchema(); // assuming this is your Zod schema
    schema.parse({ title }); // Validates the survey data

    next();
  } catch (error) {
    const { headers } = req;
    const currentLang = headers["accept-language"] as "en" | "de";
    if (error instanceof ZodError) {
      console.log(validateWithSchema(error, currentLang));
      next(
        new CustomError(
          "validation Error",
          400,
          true,
          "`validationError`",
          "",
          validateWithSchema(error, currentLang)
        )
      );
    }
    next(error);
  }
};

export const checkWorkspaceExistsForSurvey = async (
  req: Request<
    { surveyId: string; workspaceId: string },
    {},
    {
      workspaceId: string;
      isActive: boolean;
      title: string;
      targetWorkspaceId: string;
    }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      groupId: string;
      userId: string;
      duplicateSurvey?: SurveyModel;
    }
  >,
  next: NextFunction
) => {
  const { workspaceId } = req.params;
  const { workspaceId: workspaceIdFromBody } = req.body;
  try {
    const idToLookFor = workspaceId ?? workspaceIdFromBody;
    if (isNaN(+idToLookFor)) {
      return next(
        new CustomError("Invalid workspace ID", 400, true, "workspaceNotFound")
      );
    }

    const workspace = await WorkSpace.findOne({
      where: { id: idToLookFor },
    });

    if (!workspace) {
      return next(
        new CustomError("Workspace not found", 404, true, "workspaceNotFound")
      );
    }

    // Store the groupId for later use
    res.locals.groupId = workspace.groupId.toString();

    next(); // Proceed to the next middleware
  } catch (error) {
    return next(error);
  }
};

export const checkSurveyExists = async (
  req: Request<
    { surveyId: string },
    {},
    {
      workspaceId: string;
      isActive: boolean;
      title: string;
      targetWorkspaceId: string;
    }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      groupId: string;
      userId: string;
      duplicateSurvey?: SurveyModel;
    }
  >,
  next: NextFunction
) => {
  const { surveyId } = req.params;
  const { title } = req.body;

  try {
    if (Number.isNaN(+surveyId)) {
      return next(
        new CustomError("Invalid survey ID", 400, true, "invalidSurveyId")
      );
    }

    const survey = await Survey.findOne({
      where: { id: surveyId },
    });

    if (!survey) {
      return next(
        new CustomError("Survey not found", 404, true, "surveyNotFound")
      );
    }
    console.log("survey found from middleware");

    if (title !== survey.title) {
      res.locals.duplicateSurvey = {
        ...survey.get(),
        title,
        createdAt: new Date(),
        updatedAt: undefined,
        url: title + "url",
      };
    }

    next();
  } catch (error) {
    return next(error);
  }
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
  const { surveyId } = req.params;
  const { title, workspaceId } = req.body;

  if (!title || title.trim().length === 0) {
    return next(
      new CustomError("Survey title is required", 400, true, "titleRequired")
    );
  }

  const existingSurvey = await Survey.findOne({
    where: { title, workspace: workspaceId, id: { [Op.not]: surveyId } },
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
    updateUrlSchema().parse({ url });

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
    console.log("errrorrororor");
    const { headers } = req;
    const currentLang = headers["accept-language"] as "en" | "de";
    if (error instanceof ZodError) {
      console.log("zodError");
      next(
        new CustomError(
          "validation Error",
          400,
          true,
          "`validationError`",
          "",
          validateWithSchema(error, currentLang)
        )
      );
    }
    next(error);
  }
};

export const validateSurveyForMoving = async (
  req: Request<
    { surveyId: string },
    {},
    { workspaceId: string; targetWorkspaceId: string }
  >,
  res: Response<{}, { workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { targetWorkspaceId } = req.body;
    const { surveyId } = req.params;
    if (isNaN(+targetWorkspaceId)) {
      return next(
        new CustomError("Invalid workspace ID", 400, true, "workspaceNotFound")
      );
    }

    const targetWorkspace = await WorkSpace.findOne({
      where: { id: targetWorkspaceId },
    });

    if (!targetWorkspace) {
      return next(
        new CustomError(
          "Target workspace not found",
          404,
          true,
          "targetWorkspaceNotFound"
        )
      );
    }
    console.log("check for validation for moving done", "done");
    next();
  } catch (error) {
    next(error);
  }
};
