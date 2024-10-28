import { Response, Request, NextFunction } from "express";
import { NewGroup, UserGroupModel, UserModel } from "../types/types";
import { CustomError } from "../errors/customError";
import User from "../db/models/User";
import UserGroup from "../db/models/UserGroup";
import { connect } from "http2";
import { Op } from "sequelize";
import { getTranslation } from "../utils";
import Group from "../db/models/Group";

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
    {
      isActive: boolean;
      title: string;
      targetWorkspaceId: string;
      workspaceId: string;
    }
  >,
  res: Response<
    {},
    { groupId: string; userId: string; groupMembers?: UserGroupModel[] }
  >,
  next: NextFunction
) => {
  try {
    const { groupId, userId } = res.locals;
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

    // Check if the user is a member or owner in a single query
    const userGroupMembership = await UserGroup.findOne({
      where: {
        userId,
        groupId,
      },
    });
    const isGroupOwner = await Group.findOne({
      where: { id: groupId, maker: userId },
    });

    // Check if the user is either a member or the owner of the group
    if (!userGroupMembership && !isGroupOwner) {
      return next(
        new CustomError(
          getTranslation(currentLang, "notAMemberOfGroup"),
          403,
          true,
          "notAMemberOfGroup"
        )
      );
    }

    // Retrieve group members only if access is granted
    const groupMembers = await UserGroup.findAll({
      where: { groupId },
    });

    // Set relevant data in response locals for use in the next middleware
    res.locals.groupId = groupId;
    res.locals.groupMembers = groupMembers.map((group) =>
      group.get({ plain: true })
    );

    next();
  } catch (error) {
    next(error);
  }
};

export const lookForUserInGroup = async (
  req: Request<
    { surveyId: string; workspaceId: string },
    {},
    {
      username: string;
      userId: number;
      groupId: number;
      groupName: string;
    }
  >,
  res: Response<
    {},
    { groupId: string; userId: string; incomingMember?: UserGroupModel }
  >,
  next: NextFunction
) => {
  try {
    const lanuage = (req.headers["accept-language"] as "en" | "de") ?? "en";
    const { userId, groupId } = req.body;

    const userGroupMembership = await UserGroup.findOne({
      where: {
        [Op.or]: {
          userId,
        },
        groupId,
      },
    });

    if (!userGroupMembership) {
      return next(
        new CustomError(
          getTranslation(lanuage, "notAMemberOfGroup"),
          403,
          true,
          "notAMemberOfGroup"
        )
      );
    }
    res.locals.groupId = userGroupMembership.groupId.toString();
    res.locals.incomingMember = userGroupMembership.get({ plain: true });
    next();
  } catch (error) {
    throw error;
  }
};

export const findUser = async (
  req: Request<
    { surveyId: string; workspaceId: string },
    {},
    {
      username: string;
      userId: number;
      groupId: number;
      groupName: string;
    }
  >,
  res: Response<{}, { groupId: string; userId: string; user?: UserModel }>,
  next: NextFunction
) => {
  try {
    const lanuage = (req.headers["accept-language"] as "en" | "de") ?? "en";
    const { username, groupId } = req.body;
    const { userId: maker } = res.locals;

    const user = await User.findOne({
      where: {
        [Op.or]: {
          username,
        },
      },
    });

    if (!user) {
      return next(
        new CustomError(
          getTranslation(lanuage, "userNotFound"),
          404,
          true,
          "userNotFound"
        )
      );
    }

    if (+maker === +user.id) {
      return next(
        new CustomError(
          getTranslation(lanuage, "cantinviteYourSelf"),
          403,
          true,
          "selfInvite"
        )
      );
    }
    const isUserInTheGroup = await UserGroup.findOne({
      where: {
        userId: user.id,
        groupId,
      },
    });

    if (isUserInTheGroup) {
      return next(
        new CustomError(
          getTranslation(lanuage, "userIsAlreadyAMember"),
          403,
          true,
          "UserAlreadyInGroup"
        )
      );
    }
    res.locals.user = user.get({ plain: true });
    next();
  } catch (error) {
    throw error;
  }
};
