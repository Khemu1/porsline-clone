import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyModel, WorkSpaceModel } from "../../types";

interface WorkspaceState {
  workspaces: WorkSpaceModel[];
}

const initialState: WorkspaceState = {
  workspaces: [],
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<WorkSpaceModel[]>) => {
      state.workspaces = action.payload;
    },
    signOut: (state) => {
      state.workspaces = [];
    },
    addWorkspace: (state, action: PayloadAction<WorkSpaceModel>) => {
      state.workspaces.push(action.payload);
    },
    updateWorkspace: (
      state,
      action: PayloadAction<{ workspaceData: WorkSpaceModel; id: number }>
    ) => {
      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === action.payload.id
          ? { ...workspace, ...action.payload.workspaceData }
          : workspace
      );
    },
    deleteWorkspace: (state, action: PayloadAction<number>) => {
      state.workspaces = state.workspaces.filter(
        (workspace) => workspace.id !== action.payload
      );
    },
    addSurveyToWorkspace: (state, action: PayloadAction<SurveyModel>) => {
      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id !== action.payload.workspace
          ? { ...workspace, surveys: [...workspace.surveys, action.payload] }
          : workspace
      );
    },
    deleteWorkspaceSurvey: (
      state,
      action: PayloadAction<{ surveyId: number; workspaceId: number }>
    ) => {
      const workspace = state.workspaces.find(
        (ws) => +ws.id === +action.payload.workspaceId
      )!;
      const updatedSurveys = workspace.surveys.filter(
        (survey) => survey.id !== action.payload.surveyId
      )!;

      state.workspaces = state.workspaces.map((ws) =>
        +ws.id === +action.payload.workspaceId
          ? { ...ws, surveys: [...updatedSurveys] }
          : ws
      );
    },
    updateWorkspaceSurvey: (state, action: PayloadAction<SurveyModel>) => {
      const workspace = state.workspaces.find(
        (ws) => +ws.id === +action.payload.workspace
      )!;
      const surveyToUpdate = workspace.surveys.find(
        (survey) => survey.id === action.payload.id
      )!;

      const updatedSurvey = { ...surveyToUpdate, ...action.payload };
      const updatedSurveys = workspace.surveys.map((survey) =>
        survey.id === +action.payload.id ? updatedSurvey : survey
      );

      const updatedWorkspace = { ...workspace, surveys: updatedSurveys };
      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace
      );
    },
  },
});

export const {
  setWorkspaces,
  signOut,
  updateWorkspace,
  deleteWorkspace,
  addWorkspace,
  addSurveyToWorkspace,
  deleteWorkspaceSurvey,
  updateWorkspaceSurvey,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
