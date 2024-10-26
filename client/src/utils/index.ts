import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import {
  CustomEndingModel,
  DefaultEndingModel,
  GenericTextModel,
  SurveyModel,
  WelcomePartModel,
  WorkSpaceModel,
} from "../types";
import {
  clearCurrentSurvey,
  updateCurrentSurvey,
} from "../store/slices/currentSurveySlice";
import {
  addSurvey,
  setSurveys,
  updateSurveys,
  deleteSurvey,
} from "../store/slices/surveySlice";
import {
  addSurveyToWorkspace,
  addWorkspace,
  deleteWorkspace,
  deleteWorkspaceSurvey,
  moveSurveyToAnotherWorkspace,
  updateWorkspace,
  updateWorkspaceSurvey,
} from "../store/slices/workspaceSlice";
import {
  addSurveyToCurrentWorkspace,
  deleteCurrnetWorkspaceSurvey,
  setCurrentWorkspace,
  updateCurrentWorkspace,
  updateCurrentWorkspaceSurveys,
} from "../store/slices/currentWorkspaceSlice";
import { TranslationKeys } from "./genericText";
import {
  resetWelcomePart,
  updateWelcomePart,
} from "../store/slices/welcomePartSlice";
import {
  addGenericText,
  removeGenericText,
  updateGenericText,
} from "../store/slices/questionsSlice";
import {
  addCustomEnding,
  addDefaultEnding,
  deleteCustomEnding,
  deleteDefaultEnding,
  setDefaultEnding,
  updateCustomEnding,
  updateDefaultEnding,
} from "../store/slices/endingsSlice";
import { resetDefaultEndingSliceFields } from "../store/slices/defaultEnding";
import { resetWelcomePartSliceFields } from "../store/slices/welcomePageSlice";
import { resetRedirectEndingSliceFields } from "../store/slices/redirectEnding";
import { resetGenericTextSliceFields } from "../store/slices/genericTextSlice";
import { resetSharedFormSliceFields } from "../store/slices/sharedFormSlice";

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

export const addSurveyF = async (
  currentWorkspaceId: number,
  newSurvey: SurveyModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    if (newSurvey.workspace === currentWorkspaceId) {
      dispatch(updateCurrentWorkspaceSurveys(newSurvey));
      dispatch(updateSurveys(newSurvey));
    }
    dispatch(addSurveyToWorkspace(newSurvey));
  } catch (error) {
    console.error("Error adding survey:", error);
  }
};

export const deleteSurveyF = async (
  surveyId: number,
  currnetWorkspaceId: number,
  surveyWorkspaceId: number,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    if (currnetWorkspaceId === surveyWorkspaceId) {
      dispatch(deleteCurrnetWorkspaceSurvey(surveyId));
      dispatch(clearCurrentSurvey());
    }
    dispatch(
      deleteWorkspaceSurvey({ surveyId, workspaceId: surveyWorkspaceId })
    );
    dispatch(deleteSurvey(surveyId));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const updateSurveyF = async (
  survey: SurveyModel,
  currentSurveyId: number,
  surveyWorkspaceId: number,
  currentWorkspaceId: number,
  dispatch: Dispatch
) => {
  try {
    console.log(
      "updating survey",
      survey,
      currentSurveyId,
      surveyWorkspaceId,
      currentWorkspaceId
    );
    if (currentWorkspaceId === surveyWorkspaceId) {
      dispatch(updateCurrentWorkspaceSurveys(survey));
    }
    if (currentSurveyId === survey.id) {
      dispatch(updateCurrentSurvey(survey));
    }
    dispatch(updateSurveys(survey));
    dispatch(updateWorkspaceSurvey(survey));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const duplicateSurveyF = async (
  newSurvey: SurveyModel,
  currentWorkspaceId: number,
  dispatch: Dispatch
) => {
  try {
    if (newSurvey.workspace === currentWorkspaceId) {
      dispatch(addSurveyToCurrentWorkspace(newSurvey));
      dispatch(addSurvey(newSurvey));
    }

    dispatch(addSurveyToWorkspace(newSurvey));
  } catch (error) {
    console.error("Error duplicating survey:", error);
  }
};

export const moveSurveyF = async (
  surveyId: number,
  sourceWorkspaceId: number,
  targetWorkspaceId: number,
  currentWorkspaceId: number,
  dispatch: Dispatch
) => {
  try {
    if (currentWorkspaceId === sourceWorkspaceId) {
      dispatch(deleteCurrnetWorkspaceSurvey(surveyId));
      dispatch(clearCurrentSurvey());
    }
    dispatch(deleteSurvey(surveyId));
    dispatch(
      moveSurveyToAnotherWorkspace({
        surveyId,
        sourceWorkspaceId,
        targetWorkspaceId,
      })
    );
  } catch (error) {
    console.error("Error moving survey:", error);
  }
};

export const updateWorkspaceF = async (
  workspaceId: number,
  workspaceData: WorkSpaceModel,
  dispatch: Dispatch
) => {
  try {
    dispatch(updateCurrentWorkspace(workspaceData));
    dispatch(updateWorkspace({ workspaceData, id: +workspaceId }));
  } catch (error) {
    console.error("Error updating survey title:", error);
  }
};

export const deleteWorkspaceF = async (
  workspaceId: number,
  currentWorkspaceId: number,
  workspaces: WorkSpaceModel[],
  dispatch: Dispatch
) => {
  try {
    dispatch(deleteWorkspace(+workspaceId));
    if (+currentWorkspaceId === +workspaceId) {
      dispatch(setCurrentWorkspace(workspaces[0]));
      dispatch(setSurveys(workspaces[0].surveys || []));
    }
  } catch (error) {
    console.error("Error deleting workspace:", error);
  }
};

export const addNewWorkspaceF = async (
  workspace: WorkSpaceModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    dispatch(addWorkspace(workspace));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const addNewQuestionF = async (
  newQuestion: GenericTextModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    dispatch(addGenericText(newQuestion));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const editQuestionF = async (
  newQuestion: GenericTextModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    dispatch(updateGenericText(newQuestion));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const removeQuestionF = async (
  questionId: number,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    dispatch(removeGenericText(+questionId));
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const addNewEndingF = async (
  ending: CustomEndingModel | DefaultEndingModel,
  type: "custom" | "default",
  dispatch: Dispatch<UnknownAction>,
  defaultEnding?: boolean
) => {
  try {
    if (type === "custom") {
      dispatch(addCustomEnding(ending as CustomEndingModel));
    } else {
      dispatch(addDefaultEnding(ending as DefaultEndingModel));
    }
    if (defaultEnding) {
      dispatch(setDefaultEnding({ id: ending.id, type }));
    }
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const editEndingF = async (
  ending: CustomEndingModel | DefaultEndingModel,
  prevType: "custom" | "default",
  prevId: number,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    const currentEndingType = ending.type;
    if (prevType !== currentEndingType) {
      if (prevType === "custom") {
        dispatch(deleteCustomEnding(prevId));
        dispatch(addDefaultEnding(ending as DefaultEndingModel));
      } else {
        dispatch(deleteDefaultEnding(prevId));
        dispatch(addCustomEnding(ending as CustomEndingModel));
      }
    } else {
      if (currentEndingType === "custom") {
        dispatch(updateCustomEnding(ending as CustomEndingModel));
      } else {
        dispatch(updateDefaultEnding(ending as DefaultEndingModel));
      }
    }
    if (ending.defaultEnding) {
      dispatch(setDefaultEnding({ id: ending.id, type: currentEndingType }));
    }
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
};

export const deleteEndingF = async (
  endingId: number,
  type: "custom" | "default",
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    if (type === "custom") {
      dispatch(deleteCustomEnding(endingId));
    } else {
      dispatch(deleteDefaultEnding(endingId));
    }
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

export const validateMinMax = (
  minValue: number,
  maxValue: number,
  t: (key: TranslationKeys) => string
) => {
  const errors: { minLength?: string; maxLength?: string } = {};

  if (minValue === undefined || typeof minValue !== "number") {
    errors.minLength = t("minRequired");
  }

  if (maxValue === undefined || typeof maxValue !== "number") {
    errors.maxLength = t("maxRequired");
  }
  if (maxValue < 1) {
    errors.maxLength = t("maxMustAtleastOne");
  }
  if (minValue && maxValue && minValue > maxValue) {
    errors.minLength = t("minGreaterThanMax");
    errors.maxLength = t("maxLesserThanMin");
  }

  return Object.keys(errors).length ? errors : null;
};

export const handleMinMaxChange = (
  type: "min" | "max",
  value: string,
  minLength: number,
  maxLength: number,
  t: (key: TranslationKeys) => string
) => {
  const parsedValue = Number(value);
  let updatedMin = minLength;
  let updatedMax = maxLength;

  if (type === "min") {
    updatedMin = parsedValue;
  } else {
    updatedMax = parsedValue;
  }

  const validationErrors = validateMinMax(updatedMin, updatedMax, t);

  return { updatedMin, updatedMax, validationErrors };
};

export const returnFileAndUrl = (
  file: File | null
): Promise<{ file: File | null; url: string | undefined }> => {
  try {
    return new Promise((resolve) => {
      let url: string | undefined = undefined;

      if (file) {
        // asynchronous
        const reader = new FileReader();
        reader.onloadend = () => {
          url = reader.result as string;
          resolve({ file, url });
        };
        reader.readAsDataURL(file);
      } else {
        resolve({ file, url });
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const validateMinMaxPreview = (
  minValue: number | undefined,
  maxValue: number | undefined,
  value: string,
  t: (key: TranslationKeys) => string
): { minMax?: string } | null => {
  const errors: { minMax?: string } = {};
  if (
    maxValue === undefined ||
    minValue === undefined ||
    value.trim().length === 0
  ) {
    return null;
  }

  if (value.length < minValue || value.length > maxValue) {
    const error = t("MinMax");
    const modifiedError = error
      .replace("{min}", minValue.toString())
      .replace("{max}", maxValue.toString());

    errors.minMax = modifiedError;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateRegex = (
  value: string,
  regexValue: string | undefined
) => {
  if (regexValue !== undefined) {
    const regexExp = new RegExp(regexValue);
    if (!regexExp.test(value)) {
      return true;
    }
  }
};

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function clearSlices(dispatch: Dispatch) {
  dispatch(resetSharedFormSliceFields());
  dispatch(resetWelcomePartSliceFields());
  dispatch(resetDefaultEndingSliceFields());
  dispatch(resetRedirectEndingSliceFields());
  dispatch(resetGenericTextSliceFields());
}

export const addWelcomePartF = async (
  newWelcomePart: WelcomePartModel,
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    dispatch(updateWelcomePart(newWelcomePart));
  } catch (error) {
    console.error("Error adding survey:", error);
  }
};

export const deleteWelcomePartF = async (dispatch: Dispatch<UnknownAction>) => {
  try {
    dispatch(resetWelcomePart());
  } catch (error) {
    console.error("Error adding survey:", error);
  }
};

export const transformDataIntoFormData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>,
  form: FormData
) => {
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      form.append(key, String(value));
    }
  }
};

export const sortEndings = (
  defaultEndings: DefaultEndingModel[],
  customEndings: CustomEndingModel[]
) => {
  const allEndings = [...defaultEndings, ...customEndings];
  const sortedEndings = allEndings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sortedEndings;
};

export const servePath = (path: string | undefined) => {
  if (path) {
    const relativePath = path.replace(
      "H:\\porsline\\server\\",
      `${import.meta.env.VITE_PROXY_URL}\\`
    );
    console.log("relativePath", relativePath);
    return relativePath;
  }
  return undefined;
};
