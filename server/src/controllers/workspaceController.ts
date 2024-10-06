import { NextFunction, Request, Response } from "express";
import { NewWorkSpace } from "../types/types";
import {
  addWorkSpaceService,
  deleteWorkspaceService,
  getWorkSpacesService,
  updateWorkspaceTitleService,
} from "../services/workspaceService";

export const addWorkSpace = async (
  req: Request<{}, {}, NewWorkSpace>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const userId = +res.locals.userId;
    const { title } = req.body;
    const workspaceData = await addWorkSpaceService(+userId, title);
    res.status(201).json(workspaceData);
  } catch (error) {
    next(error);
  }
};
export const getWorkSpaces = async (
  req: Request<{}, {}, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const userId = +res.locals.userId;
    const workspaceData = await getWorkSpacesService(+userId);
    res.status(201).json(workspaceData);
  } catch (error) {
    next(error);
  }
};

export const updateWorkspaceTitle = async (
  req: Request<{ workspaceId: string }, {}, { title: string }>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;
    const { title } = req.body;
    const data = await updateWorkspaceTitleService(+workspaceId, title);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (
  req: Request<{ workspaceId: string }, {}, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;
    await deleteWorkspaceService(+workspaceId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
