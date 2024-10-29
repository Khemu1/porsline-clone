import { Op, where } from "sequelize";
import Survey from "../db/models/Survey";
import UserGroup from "../db/models/UserGroup";
import WorkSpace from "../db/models/WorkSpace";
import { CustomError } from "../errors/customError";
import { UpdateWorkspaceTitleResponse, WorkSpaceModel } from "../types/types";
import Group from "../db/models/Group";
import WorkspaceGroup from "../db/models/WorkspaceGroup";

export const addWorkSpaceService = async (userId: number, title: string) => {
  try {
    const group = await Group.findOne({ where: { maker: userId } });
    if (!group) {
      throw new CustomError("Error finding your group", 404, true);
    }

    const workspace = await WorkSpace.create({
      title,
      maker: userId,
    });

    await WorkspaceGroup.create({
      groupId: group.id,
      workspaceId: workspace.id,
    });

    return workspace.get({ plain: true });
  } catch (error) {
    throw error;
  }
};

export const getWorkSpacesService = async (
  userId: number
): Promise<WorkSpaceModel[]> => {
  try {
    const userGroups = await UserGroup.findAll({ where: { userId } });
    const getUserOwnGroup = await Group.findOne({ where: { maker: userId } });

    
    const groupIds = userGroups
      .filter(
        (group) => group.get({ plain: true }).groupId !== getUserOwnGroup!.id
      )
      .map((group) => group.groupId);

    const myWorkspaces = await WorkSpace.findAll({
      where: { maker: userId },
      include: [{ model: Survey, as: "surveys" }],
    });

    const groupWorkspaces = await WorkSpace.findAll({
      include: [
        {
          model: Group,
          as: "groups",
          where: { id: groupIds },
          through: { attributes: [] },
        },
        { model: Survey, as: "surveys" },
      ],
      where: {
        id: { [Op.not]: myWorkspaces.map((ws) => ws.id) },
      },
    });

    const allWorkspaces = [...myWorkspaces, ...groupWorkspaces].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return allWorkspaces;
  } catch (error) {
    throw error;
  }
};
export const updateWorkspaceTitleService = async (
  workspaceId: number,
  title: string
): Promise<UpdateWorkspaceTitleResponse> => {
  try {
    const updatedDate = new Date();
    await WorkSpace.update(
      { title, updatedAt: updatedDate },
      {
        where: {
          id: workspaceId,
        },
      }
    );
    return { title, updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId: number) => {
  try {
    await WorkSpace.destroy({
      where: {
        id: workspaceId,
      },
    });
  } catch (error) {
    throw error;
  }
};
