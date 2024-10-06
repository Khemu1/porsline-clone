import { NextFunction, Request, Response } from "express";
import { NewWorkSpace } from "../types/types";
import { ZodError } from "zod";
import { CustomError } from "../errors/customError";
import WorkSpace from "../db/models/WorkSpace";
import { Op } from "sequelize";
import { validateWithSchema } from "../utils/validations/survey";
import { newWorkspaceSchema } from "../utils/validations/workspace";

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
  res: Response<{}, { workspaceId: string; userId: string; groupId: string }>,
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
  res.locals.groupId = workspace.groupId.toString();
  next();
};

export const checkDuplicateWorkspaceTitle = async (
  req: Request<{ workspaceId: string }, {}, { title: string }>,
  res: Response<{}, { groupId: string }>,
  next: NextFunction
) => {
  try {
    const { title } = req.body;
    const { workspaceId } = req.params;
    const { groupId } = res.locals;

    const exsitingWorkspace = await WorkSpace.findOne({
      where: { id: { [Op.not]: workspaceId }, title, groupId: +groupId },
    });

    if (exsitingWorkspace) {
      return next(
        new CustomError(
          "workspace with this title already exists",
          409,
          true,
          "workspaceTitleExists"
        )
      );
    }

    newWorkspaceSchema().parse({ title });

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
