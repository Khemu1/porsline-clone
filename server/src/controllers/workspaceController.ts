import { NextFunction, Request, Response } from "express";
import { NewWorkSpace, UserGroupModel } from "../types/types";
import {
  addWorkSpaceService,
  deleteWorkspaceService,
  getWorkSpacesService,
  updateWorkspaceTitleService,
} from "../services/workspaceService";
import { userSocketMap } from "../handlers/socketHandler";
import { io } from "../server";

export const addWorkSpace = async (
  req: Request<{}, {}, NewWorkSpace>,
  res: Response<{}, { userId: string; groupMembers?: UserGroupModel[] }>,
  next: NextFunction
) => {
  try {
    const userId = +res.locals.userId;
    const { title } = req.body;
    const { groupMembers } = res.locals;
    const workspaceData = await addWorkSpaceService(+userId, title);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("WORKSPACE_ADDED", {
          workspace: { ...workspaceData },
        });
      }
    });
    res.status(201).json({ workspace: { ...workspaceData } });
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
  res: Response<{}, { userId: string; groupMembers?: UserGroupModel[] }>,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;
    const { title } = req.body;
    const { groupMembers } = res.locals;
    const workspaceData = await updateWorkspaceTitleService(
      +workspaceId,
      title
    );
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("WORKSPACE_EDITED", {
          workspace: { ...workspaceData },
          workspaceId,
        });
      }
    });
    return res.status(200).json(workspaceData);
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspace = async (
  req: Request<{ workspaceId: string }, {}, {}>,
  res: Response<{}, { userId: string; groupMembers?: UserGroupModel[] }>,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;
    const { groupMembers, userId } = res.locals;
    await deleteWorkspaceService(+workspaceId);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("WORKSPACE_DELETED", {
          workspaceId: workspaceId,
        });
      }
    });

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
