import { promise } from "zod";
import Group from "../db/models/Group";
import User from "../db/models/User";
import { CustomError } from "../errors/customError";
import UserGroup from "../db/models/UserGroup";
import { GroupModel, UserGroupModel } from "../types/types";

export const addToGroupService = async (
  users: number[],
  groupName: string,
  maker: number
) => {
  try {
    const group = await Group.create({ name: groupName, maker });

    await Promise.all(
      users.map(async (id) => {
        await UserGroup.create({ groupId: group.id, userId: id });
      })
    );
    return group;
  } catch (error) {
    throw error;
  }
};

export const deleteGroupService = async (
  groupName: string,
  groupId: number
) => {
  try {
    const group = await Group.findOne({
      where: { name: groupName, id: groupId },
    });
    if (!group) {
      throw new CustomError(`Group ${groupName} not found`, 404, true);
    }

    await Promise.all([
      UserGroup.destroy({ where: { groupId: group.id } }),
      Group.destroy({ where: { id: group.id } }),
    ]);
  } catch (error) {
    throw error;
  }
};

export const DeleteGroupMember = async (username: string) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new CustomError(`User ${username} not found`, 404, true);
    }

    await UserGroup.destroy({ where: { userId: user.id } });
    return true;
  } catch (error) {
    throw error;
  }
};

export const getGroupService = async (
  groupId: number
): Promise<UserGroupModel[] | []> => {
  try {
    const groupAndMembers: GroupModel | null = await Group.findByPk(groupId, {
      include: [
        {
          model: UserGroup,
        },
      ],
    });
    if (!groupAndMembers?.UserGroups) {
      return [];
    }
    return groupAndMembers.UserGroups as UserGroupModel[];
  } catch (error) {
    throw error;
  }
};
