import { NextFunction, Request, Response } from "express";
import { NewWorkSpace } from "../types/types";
import {
  newWorkSpcaeSchema,
  validateWithSchema,
} from "../utils/validations/workspace";
import { ZodError } from "zod";
import { CustomError } from "../errors/customError";
import WorkSpace from "../db/models/WorkSpace";

export const validateNewWorkSpace = async (
  req: Request<{}, {}, NewWorkSpace>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const schema = newWorkSpcaeSchema();
    schema.parse(data);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(validateWithSchema(error));
    }
    next(error);
  }
};

export const checkWorkspaceExists = async (
  req: Request<{ workspaceId: string }, {}, { title: string }>,
  res: Response<{}, { workspaceId: string; userId: string }>,
  next: NextFunction
) => {
  const { workspaceId } = req.params;
  const { userId } = res.locals;
  if (isNaN(+workspaceId)) {
    return next(
      new CustomError("Invalid workspace ID", 400, true, "workspaceNotFound")
    );
  }

  const workspace = await WorkSpace.findOne({
    where: { id: workspaceId, maker: +userId },
  });

  if (!workspace) {
    return next(new CustomError("Workspace not found", 404, true));
  }

  res.locals.workspaceId = workspaceId;

  next();
};

export const checkDuplicateWorkspaceTitle = async (
  req: Request<{}, {}, { workspaceId: string; title: string }>,
  res: Response<{}, { groupId: string }>,
  next: NextFunction
) => {
  const { workspaceId, title } = req.body;
  const { groupId } = res.locals;

  const existingSurveys = await WorkSpace.findOne({
    where: { id: workspaceId, title, groupId: +groupId },
  });

  if (existingSurveys) {
    return next(
      new CustomError("Survey with this title already exists", 409, true)
    );
  }

  next();
};
