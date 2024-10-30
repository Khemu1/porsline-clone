import { NextFunction, Request, Response } from "express";
import { NewWorkSpace, UserGroupModel } from "../types/types";
import { ZodError } from "zod";
import { CustomError } from "../errors/customError";
import WorkSpace from "../db/models/WorkSpace";
import { Op } from "sequelize";
import { validateWithSchema } from "../utils/validations/survey";
import { newWorkspaceSchema } from "../utils/validations/workspace";
import UserGroup from "../db/models/UserGroup";
import { getTranslation } from "../utils";
import WorkspaceGroup from "../db/models/WorkspaceGroup";
import Group from "../db/models/Group";

export const validateNewWorkSpace = async (
  req: Request<{}, {}, NewWorkSpace>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const schema = newWorkspaceSchema();
    schema.parse(data);
    next();
  } catch (error) {
    const { headers } = req;
    const currentLang = headers["accept-language"] as "en" | "de";
    if (error instanceof ZodError) {
      return res.status(400).json(validateWithSchema(error, currentLang));
    }
    next(error);
  }
};

export const checkWorkspaceExists = async (
  req: Request<{ workspaceId: string }, {}, { title: string }>,
  res: Response<
    {},
    {
      workspaceId: string;
      userId: string;
      userGroupIds?: number[];
      workspaceOwner?: string;
    }
  >,
  next: NextFunction
) => {
  const { workspaceId } = req.params;

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

  const { userId } = res.locals;
  if (!userId) return next(new CustomError("UserID not found", 404, true));
  console.log("userId", userId);

  const userGroups = await UserGroup.findAll({
    where: {
      userId: +userId,
    },
  });

  const groupIds = userGroups.map((group) => group.groupId);

  res.locals.userGroupIds = groupIds;
  res.locals.workspaceOwner = workspace.maker.toString();
  next();
};

export const checkGroupMembershipFowWorkspace = async (
  req: Request<
    { endingId: string; surveyId: string; workspaceId: string },
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
      userGroupIds?: number[];
      userId: string;
      groupMembers?: UserGroupModel[];
      workspaceOwner?: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const { userGroupIds, workspaceOwner } = res.locals;
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
    if (!userGroupIds || userGroupIds.length === 0) {
      return next(
        new CustomError(
          getTranslation(currentLang, "notAMemberOfAnyGroup"),
          403,
          true,
          "notAMemberOfAnyGroup"
        )
      );
    }

    const hasAccess = await WorkspaceGroup.findOne({
      where: { workspaceId: workspace.id, groupId: userGroupIds },
    });

    if (!hasAccess) {
      return next(
        new CustomError(
          getTranslation(currentLang, "notAMemberOfGroup"),
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

    next();
  } catch (error) {
    next(error);
  }
};

export const checkWorkspaceTitle = async (
  req: Request<{ workspaceId: string }, {}, { title: string }>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

    const { title } = req.body;
    const { workspaceId } = req.params;

    newWorkspaceSchema().parse({ title });

    next();
  } catch (error) {
    const { headers } = req;
    const currentLang = headers["accept-language"] as "en" | "de";
    if (error instanceof ZodError) {
      console.log(validateWithSchema(error, currentLang));
      return next(
        new CustomError(
          "Validation Error",
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
