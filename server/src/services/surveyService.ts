import CustomEnding from "../db/models/CustomEnding";
import DefaultEnding from "../db/models/DefaultEnding";
import GeneralRegex from "../db/models/GeneralRegex";
import GeneralText from "../db/models/GeneralText";
import GenericText from "../db/models/GenericText";
import Survey from "../db/models/Survey";
import WelcomePart from "../db/models/WelcomePart";
import WorkSpace from "../db/models/WorkSpace";
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
  try {
    const survey = await Survey.create({
      title,
      workspace: workSpaceID,
      isActive,
      url: Date.now().toString(),
    });
    return survey.get();
  } catch (error) {
    throw error;
  }
};

export const getSurveyService = async (
  surveyId: number
): Promise<SurveyModel> => {
  try {
    const surveys = await Survey.findByPk(surveyId, {
      include: [
        {
          model: WelcomePart,
          as: "welcomePart",
        },
        {
          model: GenericText,
          as: "questions",
          include: [
            { model: GeneralRegex, as: "generalRegex" },
            {
              model: GeneralText,
              as: "generalText",
            },
          ],
        },
        {
          model: DefaultEnding,
          as: "defaultEndings",
        },
        { model: CustomEnding, as: "customEndings" },
        {
          model: WorkSpace,
          as: "itsWorkspace",
        },
      ],
      order: [["questions", "createdAt", "ASC"]], // order should be out of the include block
    });
    return surveys!.get({ plain: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateSurveyStatusService = async (surveyId: number) => {
  console.log("in service", surveyId);
  try {
    const survey = await Survey.findByPk(surveyId);
    const updatedDate = new Date();
    await Survey.update(
      { isActive: !survey!.isActive, updatedAt: updatedDate },
      {
        where: {
          id: surveyId,
        },
      }
    );
    return {
      ...survey!.get({ plain: true }),
      updatedAt: updatedDate,
      isActive: !survey!.isActive,
    };
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

    return { id: surveyId, title: title, updatedAt: updatedDate };
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

    return { id: surveyId, url, updatedAt: updatedDate };
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

export const moveSurveyService = async (
  targetWorkspaceId: number,
  surveyId: number
) => {
  try {
    await Survey.update(
      { workspace: targetWorkspaceId },
      {
        where: {
          id: surveyId,
        },
      }
    );
    return targetWorkspaceId;
  } catch (error) {
    throw error;
  }
};

export const duplicateSurveyService = async (
  targetWorkspaceId: number,
  survey: SurveyModel
) => {
  try {
    const duplicatedSurvey = await Survey.create({
      ...survey,
      workspace: targetWorkspaceId,
    });
    return duplicatedSurvey.get({ plain: true });
  } catch (error) {
    throw error;
  }
};
