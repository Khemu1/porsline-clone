import { Request, Response, NextFunction } from "express";
import {
  CustomEndingModel,
  DefaultEndingModel,
  NewCustomEnding,
  NewDefaultEnding,
  UserGroupModel,
} from "../types/types";
import {
  addEndingService,
  deleteEndingService,
  duplicateEndingService,
  editEndingService,
} from "../services/endingService";
import DefaultEnding from "../db/models/DefaultEnding";
import CustomEnding from "../db/models/CustomEnding";
import { userSocketMap } from "../handlers/socketHandler";
import { io } from "../server";

export const addEnding = async (
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
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { newEnding, groupMembers } = res.locals;
    const { type } = req.body;

    const {
      ending,
      default: defaultEnding,
      type: endingType,
    } = await addEndingService(newEnding, type);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("ENDING_ADDED", {
          ending,
          type: endingType,
          defaultEnding,
        });
      }
    });

    return res.status(201).json({ ending, type: endingType, defaultEnding });
  } catch (error) {
    next(error);
  }
};

export const deleteEnding = async (
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
      ending: DefaultEnding | CustomEnding;
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { endingId } = req.params;
    const { type, surveyId } = req.body;
    const { groupMembers } = res.locals;
    await deleteEndingService(+endingId, type);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("ENDING_DELETED", {
          surveyId,
          endingId,
          type,
        });
      }
    });

    return res.status(200).json({ endingId, type });
  } catch (error) {
    next(error);
  }
};

export const duplicateEnding = async (
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
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { ending, groupMembers } = res.locals;
    const { type } = req.body;

    const newEnding = await duplicateEndingService(ending, type);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("ENDING_DUPLICATED", {
          ending: newEnding,
          type,
        });
      }
    });

    return res.status(201).json({ ending: newEnding, type });
  } catch (error) {
    next(error);
  }
};

export const editEnding = async (
  req: Request<
    { endingId: string; type: "default" | "custom" },
    {},
    {
      workspaceId: string;
      surveyId: string;
      type: "default" | "custom";
      defaultEnding: boolean;
      currentEndingType: "default" | "custom";
    }
  >,
  res: Response<
    {},
    {
      editEnding: DefaultEndingModel | CustomEndingModel;
      workspaceId: string;
      userId: string;
      groupId: string;
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { editEnding, groupMembers } = res.locals;
    const { endingId } = req.params;
    const { currentEndingType } = req.body;
    const ending = await editEndingService(
      editEnding,
      +endingId,
      currentEndingType
    );
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("ENDING_EDITED", {
          ending,
          prevType: currentEndingType,
          prevId: +endingId,
        });
      }
    });
    return res
      .status(200)
      .json({ ending, prevType: currentEndingType, prevId: +endingId });
  } catch (error) {
    next(error);
  }
};
