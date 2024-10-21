import { NextFunction, Response, Request } from "express";
import { CustomError } from "../errors/customError";
import WorkSpace from "../db/models/WorkSpace";
import Survey from "../db/models/Survey";
import UserGroup from "../db/models/UserGroup";
import {
  NewWelcomePart,
  NewWorkSpace,
  welcomePartOptions,
} from "../types/types";
import {
  editWelcomeFormSchema,
  validateWithSchema,
  welcomeFormSchema,
} from "../utils/validations/welcomeQuestion";
import { ZodError } from "zod";
import {
  makeImage,
  processEditWelcomePartData,
  processWelcomePartData,
  processWelcomePartOptions,
} from "../utils";
import WelcomePart from "../db/models/WelcomePart";

export const checkGroupMembership = async (
  req: Request<
    { welcomeId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      welcomeData: NewWelcomePart;
      options: welcomePartOptions;
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
    { welcomeId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      welcomeData: NewWelcomePart;
      options: welcomePartOptions;
    }
  >,
  res: Response<{}, { workspaceId: string; userId: string; groupId: string }>,
  next: NextFunction
) => {
  console.log(req.body);
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
    { welcomeId: string },
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

export const validateNewWelcomePart = async (
  req: Request<
    {},
    {},
    {
      workspaceId: string;
      surveyId: string;
      welcomeData: NewWelcomePart;
      options: welcomePartOptions;
    }
  >,
  res: Response<
    {},
    {
      welcomePartData: NewWelcomePart;
      workspaceId: string;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const data = processWelcomePartData(req.body);
    const options = processWelcomePartOptions(req.body);

    const schema = welcomeFormSchema(options);
    console.log("prep cyka", data);
    schema.parse(data);
    res.locals.welcomePartData = { ...data };
    if (data.imageUrl) {
      const imageUrl = makeImage(data.imageUrl);
      res.locals.welcomePartData = { ...data, imageUrl };
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

export const validateEditWelcomePart = async (
  req: Request<
    {},
    {},
    {
      workspaceId: string;
      surveyId: string;
      welcomeData: NewWelcomePart;
      options: welcomePartOptions;
    }
  >,
  res: Response<
    {},
    {
      welcomePartData: NewWelcomePart;
      workspaceId: string;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const data = processEditWelcomePartData(req.body);
    console.log(data);
    const options = processWelcomePartOptions(req.body);

    const schema = editWelcomeFormSchema(options);
    schema.parse(data);
    res.locals.welcomePartData = { ...data };
    if (
      data.imageUrl !== null &&
      data.imageUrl !== undefined &&
      typeof data.imageUrl === "string" &&
      !data.imageUrl.includes("\\uploads\\")
    ) {
      console.log("Valid imageUrl:", data.imageUrl);
      const imageUrl = makeImage(data.imageUrl);
      res.locals.welcomePartData = { ...data, imageUrl };
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

export const checkQuestionExists = async (
  req: Request<
    { welcomeId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      welcomeData: NewWelcomePart;
      options: welcomePartOptions;
    }
  >,
  res: Response<
    {},
    {
      welcomePartData: NewWelcomePart;
      workspaceId: string;
      userId: string;
      groupId: string;
      welcomePart: WelcomePart;
    }
  >,
  next: NextFunction
) => {
  try {
    const { welcomeId } = req.params;
    const welcomePart = await WelcomePart.findOne({
      where: { id: welcomeId },
    });

    if (!welcomePart) {
      return next(
        new CustomError(
          "Welcome part not found",
          404,
          true,
          "welcomePartNotFound"
        )
      );
    }
    res.locals.welcomePart = welcomePart;
    next();
  } catch (error) {
    next(error);
  }
};
