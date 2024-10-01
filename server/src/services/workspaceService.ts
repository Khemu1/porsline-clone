import WorkSpace from "../db/models/WorkSpace";
import { WorkSpaceModel } from "../types/types";

export const addWorkSpaceService = async (userId: number, title: string) => {
  try {
    const workspace = await WorkSpace.create({ title, maker: userId });
    const { title: _, createdAt, ...worksapceData } = workspace.get();
    return worksapceData;
  } catch (error) {
    throw error;
  }
};

export const getWorkSpacesService = async (
  userId: number
): Promise<WorkSpaceModel[]> => {
  try {
    const workspaces = await WorkSpace.findAll({
      where: {
        maker: userId,
      },
      order: [
        ["createdAt", "ASC"],
        ["updatedAt", "DESC"],
      ],
      attributes: {
        exclude: ["maker", "updatedAt"],
      },
    });
    return workspaces.map((workspace) => {
      const plainWorkspace = workspace.get();
      return plainWorkspace as WorkSpaceModel;
    });
  } catch (error) {
    throw error;
  }
};
