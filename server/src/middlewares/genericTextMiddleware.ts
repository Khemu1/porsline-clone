import { NextFunction, Response, Request } from "express";
import { CustomError } from "../errors/customError";
import WorkSpace from "../db/models/WorkSpace";
import Survey from "../db/models/Survey";
import UserGroup from "../db/models/UserGroup";
import {
  editQuestion,
  GenericTextModel,
  NewQuestion,
  NewQuestionOptions,
  NewWelcomePart,
} from "../types/types";
import { validateWithSchema } from "../utils/validations/welcomeQuestion";
import { ZodError } from "zod";
import {
  makeImage,
  processEditQuestionData,
  processNewQuestionOptions,
  processQuestionData,
} from "../utils";
import {
  editGenericTextSchema,
  genericTextSchema,
} from "../utils/validations/genericText";
import GenericText from "../db/models/GenericText";
import GeneralRegex from "../db/models/GeneralRegex";
import GeneralText from "../db/models/GeneralText";

export const checkGroupMembership = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<{}, { groupId: string; userId: string }>,
  next: NextFunction
) => {
  try {
    const { groupId, userId } = res.locals;
    const userGroupMembership = await UserGroup.findOne({
      where: {
        userId,
        groupId,
      },
    });

    if (!userGroupMembership) {
      return next(
        new CustomError(
          "User is not a member of the group",
          403,
          true,
          "notAMemberOfGroup"
        )
      );
    }
    res.locals.groupId = userGroupMembership.groupId.toString();
    console.log("check for ownership done", "done");
    next();
  } catch (error) {
    throw error;
  }
};

export const checkWorkspaceExists = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<{}, { workspaceId: string; userId: string; groupId: string }>,
  next: NextFunction
) => {
  const { workspaceId } = req.body;
  if (isNaN(+workspaceId) || +workspaceId < 1) {
    return next(
      new CustomError("Invalid workspace ID", 400, true, "workspaceNotFound")
    );
  }

  const workspace = await WorkSpace.findOne({
    where: { id: +workspaceId },
  });

  if (!workspace) {
    return next(new CustomError("Workspace not found", 404, true));
  }
  res.locals.groupId = workspace.groupId.toString();
  next();
};

export const checkSurveyExists = async (
  req: Request<
    { questionId: string },
    {},
    {
      surveyId: string;
      workspaceId: string;
    }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      newQuestion: NewQuestion;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  const { surveyId } = req.body;

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

    next();
  } catch (error) {
    return next(error);
  }
};

export const validateNewQuestion = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<
    {},
    {
      newQuestion: NewQuestion;
      workspaceId: string;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const data = processQuestionData(req.body);
    const options = processNewQuestionOptions(req.body);
    const schema = genericTextSchema(options);
    schema.parse(data);
    res.locals.newQuestion = { ...data };
    if (data.imageUrl) {
      const imageUrl = makeImage(data.imageUrl);
      res.locals.newQuestion = { ...data, imageUrl };
    }
    console.log("validated");
    next();
  } catch (error) {
    const { headers } = req;
    const currentLang = headers["accept-language"] as "en" | "de";
    if (error instanceof ZodError) {
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

export const validateEditQuestion = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
      currentEndingType: "default" | "custom";
    }
  >,
  res: Response<
    {},
    {
      newQuestion: editQuestion;
      workspaceId: string;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const data = processEditQuestionData(req.body);
    const options = processNewQuestionOptions(req.body);
    const schema = editGenericTextSchema(options);
    schema.parse(data);
    res.locals.newQuestion = { ...data };
    if (
      data.imageUrl !== null &&
      data.imageUrl !== undefined &&
      typeof data.imageUrl === "string" &&
      !data.imageUrl.includes("\\uploads\\")
    ) {
      const imageUrl = makeImage(data.imageUrl);
      res.locals.newQuestion = { ...data, imageUrl };
    }
    next();
  } catch (error) {
    const { headers } = req;
    const currentLang = headers["accept-language"] as "en" | "de";
    if (error instanceof ZodError) {
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

export const checkGenericTextExists = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<
    {},
    {
      newQuestion: NewQuestion;
      workspaceId: string;
      userId: string;
      groupId: string;
      questionId: string;
      question: GenericTextModel;
    }
  >,
  next: NextFunction
) => {
  try {
    const { questionId } = req.params;

    const genericText = await GenericText.findOne({
      where: { id: questionId },
      include: [
        { model: GeneralText, as: "generalText" },
        { model: GeneralRegex, as: "generalRegex" },
      ],
    });

    if (!genericText) {
      return next(
        new CustomError(
          "Generic text not found",
          404,
          true,
          "genericTextNotFound"
        )
      );
    }

    const plainGenericText = genericText.get({ plain: true });

    res.locals.question = plainGenericText;

    next();
  } catch (error) {
    return next(error);
  }
};
