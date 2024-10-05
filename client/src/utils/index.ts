import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import {
  SurveyModel,
  UpdateSurveyTitleResponse,
  WorkSpaceModel,
} from "../types";
import {
  clearCurrentSurvey,
  setCurrentSurvey,
} from "../store/slices/currentSurveySlice";
import { setSurveys } from "../store/slices/surveySlice";
import { setWorkspaces } from "../store/slices/workspaceSlice";
import { setCurrentWorkspace } from "../store/slices/currentWorkspaceSlice";

export const mapSurveyErrorsTranslations = (translations: string) => {
  return Object.entries(translations).map(([lang, errors]) => {
    return {
      language: lang,
      translations: Object.entries(errors).map(([key, value]) => ({
        key,
        value,
      })),
    };
  });
};

// Function to Map Workspace Translations
export const mapWorkspaceTranslations = (translations: string) => {
  return Object.entries(translations).map(([lang, workspace]) => {
    return {
      language: lang,
      translations: Object.entries(workspace).map(([key, value]) => ({
        key,
        value,
      })),
    };
  });
};

export const addSurvey = async (
  newSurvey: SurveyModel,
  workspaces: WorkSpaceModel[],
  surveys: SurveyModel[],
  currentWorkSpace: WorkSpaceModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    const updatedSurveys = [...surveys, newSurvey];
    console.log("updated surveys", updatedSurveys);

    const updatedWorkspaces = workspaces.map((workspace) => {
      if (workspace.id === currentWorkSpace.id) {
        return {
          ...workspace,
          surveys: updatedSurveys,
        };
      }
      return workspace;
    });

    const updatedCurrentWorkspace = {
      ...currentWorkSpace,
      surveys: updatedSurveys,
    };

    // Dispatch the updated workspaces and surveys
    dispatch(setWorkspaces(updatedWorkspaces));
    dispatch(setSurveys(updatedSurveys));
    dispatch(setCurrentWorkspace(updatedCurrentWorkspace)); // Make sure current workspace is updated!
  } catch (error) {
    console.error("Error adding survey:", error);
  }
};

export const deleteSurvey = async (
  surveyId: number,
  workspaces: WorkSpaceModel[],
  surveys: SurveyModel[],
  currentWorkSpace: WorkSpaceModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    const updatedSurveys = surveys.filter((survey) => survey.id !== surveyId);

    const updatedWorkspaces = workspaces.map((workspace) => {
      if (workspace.id === currentWorkSpace.id) {
        return {
          ...workspace,
          surveys: updatedSurveys,
        };
      }
      return workspace;
    });

    const updatedCurrentWorkspace = {
      ...currentWorkSpace,
      surveys: updatedSurveys,
    };

    dispatch(setWorkspaces(updatedWorkspaces));
    dispatch(setSurveys(updatedSurveys));
    dispatch(setCurrentWorkspace(updatedCurrentWorkspace));
    dispatch(clearCurrentSurvey());
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const updateSurveyTitleF = async (
  data: UpdateSurveyTitleResponse,
  surveyId: number, // Add missing comma here
  workspaces: WorkSpaceModel[],
  surveys: SurveyModel[],
  currentWorkspace: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    const currentSurvey = surveys.find((survey) => survey.id === surveyId);

    if (!currentSurvey) {
      throw new Error("Survey not found");
    }

    const updatedSurvey: SurveyModel = {
      ...currentSurvey,
      title: data.title,
      updatedAt: data.updatedAt,
    };

    const updatedSurveys = surveys.map((survey) =>
      survey.id === updatedSurvey.id
        ? {
            ...survey,
            title: updatedSurvey.title,
            updatedAt: updatedSurvey.updatedAt,
          }
        : survey
    );

    const updatedCurrentWorkspace: WorkSpaceModel = {
      ...currentWorkspace,
      surveys: updatedSurveys,
    };

    const updatedWorkspaces = workspaces.map((workspace) =>
      workspace.id === updatedCurrentWorkspace.id
        ? updatedCurrentWorkspace
        : workspace
    );
    dispatch(setCurrentSurvey(updatedSurvey));
    dispatch(setSurveys(updatedSurveys));
    dispatch(setCurrentWorkspace(updatedCurrentWorkspace));
    dispatch(setWorkspaces(updatedWorkspaces));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const duplicateSurveyF = async (
  duplicatedSurvey: SurveyModel,
  targetWorkspaceId: number,
  workspaces: WorkSpaceModel[],
  surveys: SurveyModel[],
  currentWorkspace: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    const updatedSurveys = [...surveys, duplicatedSurvey];

    const updatedWorkspaces = workspaces.map((workspace) => {
      if (workspace.id === targetWorkspaceId) {
        return {
          ...workspace,
          surveys: [...workspace.surveys, duplicatedSurvey],
        };
      } else if (workspace.id === currentWorkspace.id) {
        return {
          ...workspace,
          surveys: updatedSurveys,
        };
      }
      return workspace;
    });

    dispatch(setSurveys(updatedSurveys));
    dispatch(setWorkspaces(updatedWorkspaces));
    dispatch(setCurrentSurvey(duplicatedSurvey));
  } catch (error) {
    console.error("Error duplicating survey:", error);
  }
};

export const moveSurveyF = async (
  surveyId: number,
  targetWorkspaceId: number,
  workspaces: WorkSpaceModel[],
  surveys: SurveyModel[],
  currentWorkspace: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    const surveyToMove = surveys.find((survey) => survey.id === surveyId);

    const filteredSurveys = surveys.filter((survey) => survey.id !== surveyId);

    const newCurrentWorkspace = {
      ...currentWorkspace,
      surveys: [...filteredSurveys],
    };

    const updatedWorkspaces = workspaces.map((workspace) => {
      if (workspace.id === targetWorkspaceId) {
        return {
          ...workspace,
          surveys: [...workspace.surveys, surveyToMove!],
        };
      }
      return workspace;
    });

    dispatch(setSurveys(filteredSurveys));
    dispatch(setWorkspaces(updatedWorkspaces));
    dispatch(setCurrentWorkspace(newCurrentWorkspace));
    dispatch(clearCurrentSurvey());
  } catch (error) {
    console.error("Error moving survey:", error);
  }
};

export const toggleSurveyActiveF = async (
  surveyId: number,
  workspaces: WorkSpaceModel[],
  surveys: SurveyModel[],
  currentWorkspace: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    console.log("toggleSurveyActiveF", surveyId);

    const surveyToToggle = surveys.find((survey) => survey.id === surveyId);

    if (!surveyToToggle) {
      throw new Error("Survey not found");
    }

    const updatedSurvey: SurveyModel = {
      ...surveyToToggle,
      isActive: !surveyToToggle.isActive,
    };

    const updatedSurveys = surveys.map((survey) =>
      survey.id === surveyId ? updatedSurvey : survey
    );

    const newCurrentWorkspace = {
      ...currentWorkspace,
      surveys: updatedSurveys.filter(
        (survey) => survey.workspace === currentWorkspace.id
      ),
    };

    const updatedWorkspaces = workspaces.map((workspace) => {
      if (workspace.id === currentWorkspace.id) {
        return newCurrentWorkspace;
      }
      return workspace;
    });

    dispatch(setSurveys(updatedSurveys));
    dispatch(setWorkspaces(updatedWorkspaces));
    dispatch(setCurrentWorkspace(newCurrentWorkspace));
    dispatch(clearCurrentSurvey());
  } catch (error) {
    console.error("Error toggling survey active status:", error);
  }
};
