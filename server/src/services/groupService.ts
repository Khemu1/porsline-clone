import UserGroup from "../db/models/UserGroup";
import { UserModel } from "../types/types";

export const addToGroupService = async (
  user: UserModel,
  groupId: number,
  groupName: string
) => {
  try {
    const groupMember = await UserGroup.create({
      groupId,
      userId: user.id,
      username: user.username,
      groupName,
    });

    return groupMember;
  } catch (error) {
    throw error;
  }
};

export const removeGroupMemberService = async (
  userId: number,
  groupId: number
) => {
  try {
    await UserGroup.destroy({ where: { userId: userId, groupId: groupId } });
  } catch (error) {
    throw error;
  }
};
