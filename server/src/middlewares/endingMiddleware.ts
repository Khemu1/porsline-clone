import { NextFunction, Response, Request } from "express";
import { CustomError } from "../errors/customError";
import WorkSpace from "../db/models/WorkSpace";
import Survey from "../db/models/Survey";
import UserGroup from "../db/models/UserGroup";
import {
  CustomEndingModel,
  DefaultEndingModel,
  NewCustomEnding,
  NewDefaultEnding,
  NewQuestion,
} from "../types/types";
import { validateWithSchema } from "../utils/validations/welcomeQuestion";
import { ZodError } from "zod";
import {
  makeImage,
  processCustomEndingData,
  processDefaultEndingData,
  processDefaultEndingOptions,
} from "../utils";
import {
  customEndingSchema,
  defaultEndingSchema,
} from "../utils/validations/endings";
import DefaultEnding from "../db/models/DefaultEnding";
import CustomEnding from "../db/models/CustomEnding";

export const checkGroupMembership = async (
  req: Request<{ endingId: string; type: "default" | "custom" }, {}, {}>,
  res: Response<
    {},
    {
      groupId: string;
      userId: string;
    }
  >,
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
    { endingId: string; type: "default" | "custom" },
    {},
    { workspaceId: string; surveyId: string }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      userId: string;
      groupId: string;
      newEnding: NewDefaultEnding | NewCustomEnding;
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
  res.locals.groupId = workspace.groupId.toString();
  next();
};

export const checkSurveyExists = async (
  req: Request<
    { endingId: string; type: "default" | "custom" },
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

export const validateNewEnding = async (
  req: Request<
    { endingId: string; type: "default" | "custom" },
    {},
    {
      workspaceId: string;
      surveyId: string;
      type: "default" | "custom";
      defaultEnding: boolean;
    }
  >,
  res: Response<
    {},
    {
      newEnding: NewDefaultEnding | NewCustomEnding;
      workspaceId: string;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const { defaultEnding, type } = req.body;
    const customEndingData = processCustomEndingData(req.body);
    const defaultEndingData = processDefaultEndingData(req.body);
    const defaultEndingOptions = processDefaultEndingOptions(req.body);
    console.log(defaultEnding);
    const defaultSchema = defaultEndingSchema(defaultEndingOptions);
    const customSchema = customEndingSchema(defaultEnding);

    if (type === "custom") {
      console.log(customEndingData);
      customSchema.parse(customEndingData);
      res.locals.newEnding = customEndingData;
    } else {
      defaultSchema.parse(defaultEndingData);

      if (defaultEndingData.imageUrl) {
        const imageUrl = makeImage(defaultEndingData.imageUrl);
        res.locals.newEnding = { ...defaultEndingData, imageUrl };
      } else {
        res.locals.newEnding = defaultEndingData;
      }
    }

    next();
  } catch (error) {
    const currentLang = (req.headers["accept-language"] as "en" | "de") || "en";

    if (error instanceof ZodError) {
      const validationErrors = validateWithSchema(error, currentLang);
      next(
        new CustomError(
          "Validation Error",
          400,
          true,
          "validationError",
          "",
          validationErrors
        )
      );
    } else {
      next(new CustomError("Unknown Error", 500, true, "unknownError", ""));
    }
  }
};

export const checkEndingExists = async (
  req: Request<
    { endingId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      type: "default" | "custom";
      defaultEnding: boolean;
    }
  >,
  res: Response<
    {},
    {
      newEnding: NewDefaultEnding | NewCustomEnding;
      workspaceId: string;
      userId: string;
      groupId: string;
      ending: DefaultEndingModel | CustomEndingModel;
    }
  >,
  next: NextFunction
) => {
  try {
    const { endingId } = req.params;
    const { type } = req.body;

    if (type === "custom") {
      const customEnding = await CustomEnding.findOne({
        where: { id: endingId },
      });

      if (!customEnding) {
        return next(
          new CustomError(
            "Custom ending not found",
            404,
            true,
            "endingNotFound"
          )
        );
      }

      res.locals.ending = customEnding.get();
    } else if (type === "default") {
      const defaultEnding = await DefaultEnding.findOne({
        where: { id: endingId },
      });

      if (!defaultEnding) {
        return next(
          new CustomError(
            "Default ending not found",
            404,
            true,
            "endingNotFound"
          )
        );
      }

      res.locals.ending = defaultEnding.get();
    } else {
      return next(
        new CustomError("Invalid type provided", 400, true, "invalidType")
      );
    }

    next();
  } catch (error) {
    return next(
      new CustomError(
        "An error occurred while checking the ending",
        500,
        true,
        "internalServerError"
      )
    );
  }
};
