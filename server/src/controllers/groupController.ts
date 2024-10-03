import { NextFunction, Request, Response } from "express";
import { NewGroup } from "../types/types";
import { getSurveyService } from "../services/surveyService";
import { addToGroupService, getGroupService } from "../services/groupService";

export const newGroup = async (
  req: Request<{}, {}, {}, {}, { groupData: NewGroup }>,
  res: Response<{}, { groupData: NewGroup; userId: number }>,
  next: NextFunction
) => {
  try {
    const { groupName, invitedUsers } = res.locals.groupData;
    const groupData = await addToGroupService(
      invitedUsers,
      groupName,
      res.locals.userId
    );
    return res.status(201).json(groupData);
  } catch (error) {
    next(error);
  }
};
export const getGroup = async (
  req: Request<{ workspaceId: string }, {}, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const userId = Number(res.locals.userId);
    const groupData = (await getGroupService(userId)) || [];
    return res.status(200).json(groupData);
  } catch (error) {
    next(error);
  }
};
