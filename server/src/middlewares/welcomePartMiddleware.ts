import { NextFunction, Response, Request } from "express";
import { CustomError } from "../errors/customError";
import WorkSpace from "../db/models/WorkSpace";
import Survey from "../db/models/Survey";
import UserGroup from "../db/models/UserGroup";
import {
  NewWelcomePart,
  UserGroupModel,
  welcomePartOptions,
} from "../types/types";
import {
  editWelcomeFormSchema,
  validateWithSchema,
  welcomeFormSchema,
} from "../utils/validations/welcomeQuestion";
import { ZodError } from "zod";
import {
  getTranslation,
  makeImage,
  processEditWelcomePartData,
  processWelcomePartData,
  processWelcomePartOptions,
} from "../utils";
import WelcomePart from "../db/models/WelcomePart";
import Group from "../db/models/Group";
import WorkspaceGroup from "../db/models/WorkspaceGroup";

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
  res: Response<
    {},
    { groupId: string; userId: string; groupMembers?: UserGroupModel[] }
  >,
  next: NextFunction
) => {
  try {
    const { groupId, userId } = res.locals;
    console.log(res.locals ? "not empty" : "empty");
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

    const userGroupMembership = await UserGroup.findOne({
      where: {
        userId,
        groupId,
      },
    });
    const isGroupOwner = await Group.findOne({
      where: { id: groupId, maker: userId },
    });

    if (!userGroupMembership && !isGroupOwner) {
      return next(
        new CustomError(
          getTranslation(currentLang, "notAMemberOfGroup"),
          403,
          true,
          "notAMemberOfGroup"
        )
      );
    }

    // Retrieve group members only if access is granted
    const groupMembers = await UserGroup.findAll({
      where: { groupId },
    });

    res.locals.groupId = groupId;
    res.locals.groupMembers = groupMembers.map((group) =>
      group.get({ plain: true })
    );

    next();
  } catch (error) {
    next(error);
  }
};

export const checkWorkspaceExistsForSurveyBuilder = async (
  req: Request<
    {
      endingId: string;
      welcomeId: string;
      surveyId: string;
      workspaceId: string;
    },
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
      workspaceId: string;
      userId: string;
      workspaceOwner?: string;
      userGroupIds?: number[];
    }
  >,
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
  const userGroups = await UserGroup.findAll({
    where: {
      userId: +workspace.maker,
    },
  });
  res.locals.userGroupIds = userGroups.map((group) => group.groupId);

  res.locals.workspaceOwner = workspace.maker.toString();
  next();
};

export const checkGroupMembershipforSurveyBulder = async (
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
    // const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

    if (!userGroupIds || userGroupIds.length === 0) {
      return next(new CustomError("", 403, true, "notAMemberOfAnyGroup"));
    }

    const hasAccess = await WorkspaceGroup.findOne({
      where: { workspaceId: finalWorkspaceId, groupId: userGroupIds },
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

    next();
  } catch (error) {
    next(error);
  }
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
      return next(new CustomError("", 400, true, "invalidSurveyId"));
    }

    const survey = await Survey.findOne({
      where: { id: surveyId },
    });

    if (!survey) {
      return next(new CustomError("", 404, true, "surveyNotFound"));
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
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";
    const { userId } = res.locals;
    // const workspace = await WorkSpace.findOne({
    //   where: { maker: +userId },
    //   include: [
    //     {
    //       model: Survey,
    //       as: "surveys",
    //       where: { id: req.body.surveyId },
    //       required: true,
    //       include: [
    //         {
    //           model: WelcomePart,
    //           as: "welcomePart",
    //           required: true,
    //         },
    //       ],
    //     },
    //   ],
    // });

    // if (workspace && workspace.get({ plain: true }).surveys?.length !== 0) {
    //   return next(
    //     new CustomError(
    //       getTranslation(currentLang, "welcomePartExists"),
    //       409,
    //       true,
    //       "welcomePartExists"
    //     )
    //   );
    // }

    // Process and validate `welcomePart` data if no existing record is found
    const data = processWelcomePartData(req.body);
    const options = processWelcomePartOptions(req.body);
    const schema = welcomeFormSchema(options);
    schema.parse(data);

    res.locals.welcomePartData = { ...data };
    if (data.imageUrl) {
      const imageUrl = makeImage(data.imageUrl);
      res.locals.welcomePartData = { ...data, imageUrl };
    }
    next();
  } catch (error) {
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";
    if (error instanceof ZodError) {
      next(
        new CustomError(
          "validation Error",
          400,
          true,
          "validationError",
          "",
          validateWithSchema(error, currentLang)
        )
      );
    } else {
      next(error);
    }
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
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";
    const { welcomeId } = req.params;
    const welcomePart = await WelcomePart.findOne({
      where: { id: welcomeId },
    });

    if (!welcomePart) {
      return next(
        new CustomError(
          getTranslation(currentLang, "welcomePartNotFound"),
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
