import Survey from "../db/models/Survey";
import { CustomError } from "../errors/customError";
import {
  SurveyModel,
  UpdateSurveyStatusResponse,
  UpdateSurveyTitleResponse,
  UpdateSurveyUrlResponse,
} from "../types/types";

export const addSurveyService = async (
  workSpaceID: number,
  title: string,
  isActive?: boolean
) => {
  if (isNaN(workSpaceID)) {
    throw new CustomError("Invalid workspace ID", 400, true);
  }
  try {
    const survey = await Survey.create({
      title,
      workspace: workSpaceID,
      isActive,
      url: Date.now().toString(),
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

export const updateSurveyStatusService = async (
  surveyId: number,
  isActive: boolean
): Promise<UpdateSurveyStatusResponse> => {
  try {
    const updatedDate = new Date();
    await Survey.update(
      { isActive, updatedAt: updatedDate },
      {
        where: {
          id: surveyId,
        },
      }
    );
    return { updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const updateSurveyTitleService = async (
  surveyId: number,
  title: string
): Promise<UpdateSurveyTitleResponse> => {
  try {
    const updatedDate = new Date();
    await Survey.update(
      { title, updatedAt: updatedDate },
      {
        where: {
          id: surveyId,
        },
      }
    );

    return { title, updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const updateSurveyUrlService = async (
  surveyId: number,
  url: string
): Promise<UpdateSurveyUrlResponse> => {
  try {
    const updatedDate = new Date();
    await Survey.update(
      { url, updatedAt: updatedDate },
      {
        where: {
          id: surveyId,
        },
      }
    );

    return { url, updatedAt: updatedDate };
  } catch (error) {
    throw error;
  }
};

export const deleteSurveyService = async (surveyId: number) => {
  try {
    await Survey.destroy({
      where: {
        id: surveyId,
      },
    });
  } catch (error) {
    throw error;
  }
};
