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
    console.log("surveyToToggle", surveyToToggle);

    const updatedSurvey: SurveyModel = {
      ...surveyToToggle!,
      isActive: !surveyToToggle!.isActive,
    };
    console.log("updatedSurvey", updatedSurvey);
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
    dispatch(setCurrentSurvey(updatedSurvey));
  } catch (error) {
    console.error("Error toggling survey active status:", error);
  }
};

export const updateWorkspaceTitleF = async (
  title: string,
  workspaces: WorkSpaceModel[],
  currentWorkspace: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    const updatedCurrentWorkspace: WorkSpaceModel = {
      ...currentWorkspace,
      title: title,
    };

    const updatedWorkspaces = workspaces.map((workspace) =>
      workspace.id === updatedCurrentWorkspace.id
        ? updatedCurrentWorkspace
        : workspace
    );

    dispatch(setCurrentWorkspace(updatedCurrentWorkspace));
    dispatch(setWorkspaces(updatedWorkspaces));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const deleteWorkspaceF = async (
  workspaces: WorkSpaceModel[],
  currentWorkSpace: WorkSpaceModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    const updatedWorkspaces = workspaces.filter(
      (workspace) => workspace.id !== currentWorkSpace.id
    );

    dispatch(setWorkspaces(updatedWorkspaces));
    dispatch(setCurrentWorkspace(updatedWorkspaces[0]));
    dispatch(setSurveys(updatedWorkspaces[0].surveys || []));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const addNewWorkspaceF = async (
  newWorkspace: WorkSpaceModel,
  workspaces: WorkSpaceModel[],
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    const modifiedWorkspaces = { ...newWorkspace, surveys: [] };
    const updatedWorkspaces = [...workspaces, modifiedWorkspaces];
    dispatch(setWorkspaces(updatedWorkspaces));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const retrunSearchData = (
  allWorkspaces: WorkSpaceModel[],
  searchTerm: string
) => {
  const allSurveys = allWorkspaces.map((workspace) => workspace.surveys).flat();
  const workspaceList = allWorkspaces.map((workspace) => workspace.title);
  const filteredWorkspaces = workspaceList.filter((workspace) =>
    workspace.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSurveys = allSurveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    workspaces: filteredWorkspaces,
    surveys: filteredSurveys,
  };
};
