import { translations } from "../components/lang/translations";
import { SurveyModel, UpdateSurveyTitleResponse } from "../types";
import { CustomError } from "../utils/CustomError";

export const updateSurveyTitle = async (
  title: string,
  workspaceId: number,
  surveyId: number,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<UpdateSurveyTitleResponse> => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/update-title`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
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
  targetWorkspaceId: number,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/duplicate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ workspaceId, title, targetWorkspaceId }),
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
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<void> => {
  console.log("updateSurveyStatus", workspaceId, surveyId);
  try {
    const response = await fetch(`/api/survey/${surveyId}/update-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ workspaceId }),
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

export const moveSurveyToWorkspace = async (
  workspaceId: number,
  surveyId: number,
  targetWorkspaceId: number,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<{ targetWorkspaceId: number }> => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/move`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
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

export const deleteSurveyFromWorkspace = async (
  workspaceId: number,
  surveyId: number,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<void> => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ workspaceId }),
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
        "DELETESurveyError",
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

export const createNewSurvey = async (
  workspaceId: number,
  title: string,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey/add-survey`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ workspaceId, title }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "DELETESurveyError",
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

export const getSurvey = async (
  workspaceId: number,
  surveyId: number,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey/${workspaceId}/${surveyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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


export const updateSurveyUrl = async (
  workspaceId: number,
  surveyId: number,
  url:string,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<SurveyModel> => {
  try {
    const response = await fetch(`/api/survey/${surveyId}/update-url`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({workspaceId,url})
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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
