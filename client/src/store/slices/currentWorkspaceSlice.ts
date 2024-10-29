import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyModel, WorkSpaceModel } from "../../types";

interface CurrentWorkspaceState {
  currentWorkspace: WorkSpaceModel | null;
}

const initialState: CurrentWorkspaceState = {
  currentWorkspace: null,
};

const currentWorkspaceSlice = createSlice({
  name: "currentWorkspace",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<WorkSpaceModel>) => {
      state.currentWorkspace = {
        ...action.payload,
        surveys: action.payload.surveys || [],
      };
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
    },
    updateCurrentWorkspace: (state, action: PayloadAction<WorkSpaceModel>) => {
      state.currentWorkspace = {
        ...state.currentWorkspace,
        ...action.payload,
        surveys:
          action.payload.surveys || state.currentWorkspace?.surveys || [],
      };
    },
    updateCurrentWorkspaceSurveys: (
      state,
      action: PayloadAction<SurveyModel>
    ) => {
      const updatedSurveys = state.currentWorkspace!.surveys.map((survey) =>
        survey.id === action.payload.id ? action.payload : survey
      );
      state.currentWorkspace = {
        ...state.currentWorkspace!,
        surveys: updatedSurveys,
      };
    },
    deleteCurrnetWorkspaceSurvey: (state, action: PayloadAction<number>) => {
      const updatedSurveys =
        state.currentWorkspace?.surveys.filter(
          (survey) => survey.id !== action.payload
        ) ?? [];
      state.currentWorkspace = {
        ...state.currentWorkspace!,
        surveys: updatedSurveys,
      };
    },
    addSurveyToCurrentWorkspace: (
      state,
      action: PayloadAction<SurveyModel>
    ) => {
      if (!state.currentWorkspace!.surveys) {
        state.currentWorkspace!.surveys = [];
      }
      state.currentWorkspace!.surveys.push(action.payload);
    },
  },
});

export const {
  setCurrentWorkspace,
  clearCurrentWorkspace,
  updateCurrentWorkspace,
  deleteCurrnetWorkspaceSurvey,
  updateCurrentWorkspaceSurveys,
  addSurveyToCurrentWorkspace,
} = currentWorkspaceSlice.actions;
export default currentWorkspaceSlice.reducer;
