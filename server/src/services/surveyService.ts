import Survey from "../db/models/Survey";
import { CustomError } from "../errors/customError";
import { SurveyModel } from "../types/types";

export const addSurveyService = async (
  workSpaceID: number,
  title: string,
  active?: boolean
) => {
  if (isNaN(workSpaceID)) {
    throw new CustomError("Invalid workspace ID", 400, true);
  }
  try {
    const survey = await Survey.create({
      title,
      workspace: workSpaceID,
      active,
    });
    const { workspace, createdAt, ...worksapceData } = survey.get();
    return worksapceData;
  } catch (error) {
    throw error;
  }
};

export const getSurveyService = async (
  workspaceId: number
): Promise<SurveyModel[]> => {
  try {
    if (isNaN(workspaceId)) {
      throw new CustomError("Invalid workspace or user ID", 400, true);
    }
    const surveys = await Survey.findAll({
      where: {
        workspace: workspaceId,
      },
      order: [
        ["createdAt", "ASC"],
        ["updatedAt", "DESC"],
      ],
      attributes: {
        exclude: ["maker", "updatedAt"],
      },
    });
    return surveys.map((survey) => {
      const plainSurvey = survey.get();
      return plainSurvey as SurveyModel;
    });
  } catch (error) {
    throw error;
  }
};
