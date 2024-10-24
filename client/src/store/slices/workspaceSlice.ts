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
        workspace.id === action.payload.workspace
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
        (ws) => ws.id === action.payload.workspace
      );

      if (!workspace) {
        console.error(
          `Workspace with ID ${action.payload.workspace} not found.`
        );
        return;
      }

      if (!workspace.surveys) {
        console.error(
          `Surveys not found for workspace with ID ${workspace.id}.`
        );
        return;
      }

      const surveyToUpdate = workspace.surveys.find(
        (survey) => survey.id === action.payload.id
      );

      if (!surveyToUpdate) {
        console.error(`Survey with ID ${action.payload.id} not found.`);
        return;
      }

      const updatedSurvey = { ...surveyToUpdate, ...action.payload };
      const updatedSurveys = workspace.surveys.map((survey) =>
        survey.id === action.payload.id ? updatedSurvey : survey
      );

      const updatedWorkspace = { ...workspace, surveys: updatedSurveys };
      state.workspaces = state.workspaces.map((ws) =>
        ws.id === updatedWorkspace.id ? updatedWorkspace : ws
      );
    },

    moveSurveyToAnotherWorkspace: (
      state,
      action: PayloadAction<{
        surveyId: number;
        sourceWorkspaceId: number;
        targetWorkspaceId: number;
      }>
    ) => {
      const { surveyId, sourceWorkspaceId, targetWorkspaceId } = action.payload;

      const sourceWorkspace = state.workspaces.find(
        (ws) => ws.id === sourceWorkspaceId
      );

      if (!sourceWorkspace) {
        console.error(
          `Source workspace with ID ${sourceWorkspaceId} not found.`
        );
        return;
      }

      const targetWorkspace = state.workspaces.find(
        (ws) => ws.id === targetWorkspaceId
      );

      if (!targetWorkspace) {
        console.error(
          `Target workspace with ID ${targetWorkspaceId} not found.`
        );
        return;
      }

      if (!sourceWorkspace.surveys) {
        console.error(
          `Surveys not found for source workspace with ID ${sourceWorkspaceId}.`
        );
        return;
      }

      const surveyToMove = sourceWorkspace.surveys.find(
        (survey) => survey.id === surveyId
      );

      if (!surveyToMove) {
        console.error(
          `Survey with ID ${surveyId} not found in source workspace.`
        );
        return;
      }

      sourceWorkspace.surveys = sourceWorkspace.surveys.filter(
        (survey) => survey.id !== surveyId
      );

      if (!targetWorkspace.surveys) {
        targetWorkspace.surveys = [];
      }

      targetWorkspace.surveys.push(surveyToMove);

      state.workspaces = state.workspaces.map((workspace) => {
        if (workspace.id === sourceWorkspaceId) {
          return { ...workspace, surveys: [...sourceWorkspace.surveys] };
        }
        if (workspace.id === targetWorkspaceId) {
          return { ...workspace, surveys: [...targetWorkspace.surveys] };
        }
        return workspace;
      });
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
  moveSurveyToAnotherWorkspace,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
