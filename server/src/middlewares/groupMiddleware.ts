import { Response, Request, NextFunction } from "express";
import { NewGroup } from "../types/types";
import { CustomError } from "../errors/customError";
import User from "../db/models/User";
import UserGroup from "../db/models/UserGroup";
import { connect } from "http2";

export const NewGroupValidation = async (
  req: Request<{}, {}, NewGroup>,
  res: Response<{}, { groupData: NewGroup }>,
  next: NextFunction
) => {
  try {
    const { invitedUsers, groupName } = req.body;

    if (
      !Array.isArray(invitedUsers) ||
      invitedUsers.length === 0 ||
      typeof groupName !== "string"
    ) {
      throw new CustomError("Invalid invited users", 400, true);
    }

    await Promise.all(
      invitedUsers.map(async (id) => {
        const user = await User.findByPk(id);
        if (!user) {
          throw new CustomError(`User not found`, 404, true);
        }
      })
    );

    res.locals.groupData = req.body;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkGroupMembership = async (
  req: Request<
    { surveyId: string; workspaceId: string },
    {},
    { isActive: boolean; title: string; targetWorkspaceId: string }
  >,
  res: Response<
    {},
    { groupId: string; userId: string }
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
