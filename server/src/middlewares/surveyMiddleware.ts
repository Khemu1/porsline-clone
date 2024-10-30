import { NextFunction, Request, Response } from "express";
import { SurveyModel, UserGroupModel } from "../types/types";
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
import { getTranslation } from "../utils";
import UserGroup from "../db/models/UserGroup";
import User from "../db/models/User";
import WorkspaceGroup from "../db/models/WorkspaceGroup";
import Group from "../db/models/Group";
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
      userId: string;
      duplicateSurvey?: SurveyModel;
      userGroupIds: number[];
      workspaceOwner: string;
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

    const { userId } = res.locals;

    // Find all groups for the invited user
    const userGroups = await UserGroup.findAll({
      where: {
        userId: +userId,
      },
    });

    // Include the owner's user group
    const ownerGroup = await UserGroup.findOne({
      where: {
        userId: workspace.maker,
      },
    });

    const userGroupIds = userGroups.map((group) => group.groupId);
    if (ownerGroup && !userGroupIds.includes(ownerGroup.groupId)) {
      userGroupIds.push(ownerGroup.groupId);
    }

    res.locals.userGroupIds = userGroupIds;
    res.locals.workspaceOwner = workspace.maker.toString();

    next();
  } catch (error) {
    return next(error);
  }
};

export const checkGroupMembershipForSurvey = async (
  req: Request<
    { surveyId: string; workspaceId: string },
    {},
    {
      isActive: boolean;
      title: string;
      targetWorkspaceId: string;
      workspaceId: string;
    }
  >,
  res: Response<
    {},
    {
      userGroupIds: number[];
      userId: string;
      groupMembers?: UserGroupModel[];
      workspaceOwner: string;
    }
  >,
  next: NextFunction
) => {
  try {
    console.log("in checkGroupMembership");
    const { userGroupIds, userId, workspaceOwner } = res.locals;
    const { workspaceId } = req.body;
    const { workspaceId: fromParams } = req.params;
    const finalWorkspaceId = workspaceId || fromParams;
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

    const workspace = await WorkSpace.findOne({
      where: { id: finalWorkspaceId },
    });

    if (!workspace) {
      return next(
        new CustomError(
          getTranslation(currentLang, "workspaceNotFound"),
          404,
          true,
          "workspaceNotFound"
        )
      );
    }
    if (userGroupIds.length === 0) {
      return next(
        new CustomError(
          getTranslation(currentLang, "notAMemberOfAnyGroup"),
          403,
          true,
          "notAMemberOfAnyGroup"
        )
      );
    }
    console.log({ workspaceId: workspace.id, groupId: userGroupIds });
    const hasAccess = await WorkspaceGroup.findOne({
      where: { workspaceId: workspace.id, groupId: userGroupIds },
    });

    if (!hasAccess) {
      return next(
        new CustomError(
          "No Access to this workspace",
          403,
          true,
          "accessDeniedToWorkspace"
        )
      );
    }

    const userGroup = await Group.findOne({
      where: { maker: workspaceOwner },
    });

    const groupMembers = await UserGroup.findAll({
      where: { groupId: userGroup?.id },
    });

    res.locals.userGroupIds = userGroupIds;
    res.locals.groupMembers = groupMembers.map((member) =>
      member.get({ plain: true })
    );

    console.log(
      "check group membership done here are the group members",
      res.locals.groupMembers
    );
    next();
  } catch (error) {
    next(error);
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
  const currentLang = (req.headers["accept-language"] as "en" | "de") || "en";
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
      attributes: { exclude: ["id", "url"] },
    });

    if (!survey) {
      return next(
        new CustomError(
          getTranslation(currentLang, "surveyNotFound"),
          404,
          true
        )
      );
    }

    res.locals.duplicateSurvey = {
      ...survey.get(),
      title,
      createdAt: new Date(),
      updatedAt: undefined,
      url: Date.now().toString() + "-survey",
    };

    next();
  } catch (error) {
    return next(error);
  }
};

export const checkSurveyExistsForPreview = async (
  req: Request<
    { surveyPath: string },
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
  const lang = (req.headers["accept-language"] as "en" | "de") ?? "en";
  const { surveyPath } = req.params;
  const { title } = req.body;

  try {
    if (!surveyPath) {
      return next(
        new CustomError(
          getTranslation(lang, "urlRequired"),
          400,
          true,
          "invalidSurveyId"
        )
      );
    }

    const survey = await Survey.findOne({
      where: { url: surveyPath },
    });

    if (!survey) {
      return next(
        new CustomError(
          getTranslation(lang, "surveyNotFound"),
          404,
          true,
          "surveyNotFound"
        )
      );
    }

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
  const lang = (req.headers["accept-language"] as "en" | "de") ?? "en";
  const { surveyId } = req.params;
  const { title, workspaceId } = req.body;

  if (!title || title.trim().length === 0) {
    return next(
      new CustomError(
        getTranslation(lang, "surveyTitleRequired"),
        400,
        true,
        "titleRequired"
      )
    );
  }

  const existingSurvey = await Survey.findOne({
    where: { title, workspace: workspaceId, id: { [Op.not]: surveyId } },
  });

  if (existingSurvey) {
    return next(
      new CustomError(
        getTranslation(lang, "surveyNotFound"),
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
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";
    const { url } = req.body;
    if (!url) {
      return next(
        new CustomError(getTranslation(currentLang, "urlRequired"), 400, true)
      );
    }
    updateUrlSchema().parse({ url });

    const existingSurvey = await Survey.findOne({
      where: { url },
    });

    if (existingSurvey) {
      return next(
        new CustomError(
          getTranslation(currentLang, "urlIsUsed"),
          409,
          true,
          "urlExists"
        )
      );
    }

    next();
  } catch (error) {
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
    const lang = (req.headers["accept-language"] as "en" | "de") ?? "en";
    const { targetWorkspaceId } = req.body;
    if (isNaN(+targetWorkspaceId)) {
      return next(
        new CustomError(
          getTranslation(lang, "workspaceNotFound"),
          400,
          true,
          "workspaceNotFound"
        )
      );
    }

    const targetWorkspace = await WorkSpace.findOne({
      where: { id: targetWorkspaceId },
    });

    if (!targetWorkspace) {
      return next(
        new CustomError(
          getTranslation(lang, "targetWorkspaceNotFound"),
          404,
          true,
          "targetWorkspaceNotFound"
        )
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
