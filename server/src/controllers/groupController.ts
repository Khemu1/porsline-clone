import { NextFunction, Request, Response } from "express";
import { NewGroup, UserModel } from "../types/types";
import { getSurveyService } from "../services/surveyService";
import {
  addToGroupService,
  removeGroupMemberService,
} from "../services/groupService";

export const addToGroup = async (
  req: Request<
    {},
    {},
    {
      username: string;
      groupName: string;
      groupId: number;
    }
  >,
  res: Response<{}, { groupId: string; user: UserModel }>,
  next: NextFunction
) => {
  try {
    const { user } = res.locals;
    const { groupName, groupId } = req.body;
    const groupData = await addToGroupService(user, +groupId, groupName);
    return res.status(201).json(groupData);
  } catch (error) {
    next(error);
  }
};
export const removeFromGroup = async (
  req: Request<{}, {}, { userId: number; groupName: string; groupId: number }>,
  res: Response<{}, { userId: string; user: UserModel }>,
  next: NextFunction
) => {
  try {
    const { userId, groupId } = req.body;
    await removeGroupMemberService(+userId, +groupId);
    return res.status(200).json(userId);
  } catch (error) {
    next(error);
  }
};
