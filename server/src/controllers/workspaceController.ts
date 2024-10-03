import { NextFunction, Request, Response } from "express";
import { NewWorkSpace } from "../types/types";
import {
  addWorkSpaceService,
  getWorkSpacesService,
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
