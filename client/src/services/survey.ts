import { translations } from "../components/lang/translations";
import {
  SurveyModel,
  UpdateSurveyStatusResponse,
  UpdateSurveyTitleResponse,
} from "../types";
import { CustomError } from "../utils/CustomError";

  
export const updateSurveyTitle = async (
  title: string,
  workspaceId: number,
  surveyId: number,
  lang:() => (typeof translations)["en"]
): Promise<UpdateSurveyTitleResponse> => {

  try {
    const response = await fetch(`/api/survey/${surveyId}/update-title`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspaceId, title }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: UpdateSurveyTitleResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const duplicateSurvey = async (
  title: string,
  workspaceId: number,
  surveyId: number,
  lang: () => (typeof translations)["en"]
): Promise<SurveyModel> => {
  try {

    const response = await fetch(`/api/survey/${surveyId}/duplicate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspaceId, title }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: SurveyModel = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSurveyStatus = async (
  workspaceId: number,
  surveyId: number,
  lang: () => (typeof translations)["en"]
): Promise<UpdateSurveyStatusResponse> => {
  try {

    const response = await fetch(`/api/survey/${surveyId}/update-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workspaceId),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: UpdateSurveyStatusResponse = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const moveSurveyToWorkspace = async (
  workspaceId: number,
  surveyId: number,
  targetWorkspaceId: number,
  lang: () => (typeof translations)["en"]
): Promise<{ targetWorkspaceId: number }> => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/move`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspaceId, surveyId, targetWorkspaceId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "MoveSurveyError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
