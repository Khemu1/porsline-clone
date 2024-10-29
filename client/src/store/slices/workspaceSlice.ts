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
      // Ensure surveys is initialized as an array for each workspace
      state.workspaces = action.payload.map((workspace) => ({
        ...workspace,
        surveys: workspace.surveys || [],
      }));
    },
    signOut: (state) => {
      state.workspaces = [];
    },
    addWorkspace: (state, action: PayloadAction<WorkSpaceModel>) => {
      // Initialize surveys if it's undefined
      const newWorkspace = {
        ...action.payload,
        surveys: action.payload.surveys || [],
      };
      state.workspaces.push(newWorkspace);
    },
    updateWorkspace: (
      state,
      action: PayloadAction<{ workspaceData: WorkSpaceModel; id: number }>
    ) => {
      state.workspaces = state.workspaces.map((workspace) =>
        workspace.id === action.payload.id
          ? {
              ...workspace,
              ...action.payload.workspaceData,
              surveys:
                action.payload.workspaceData.surveys || workspace.surveys || [],
            }
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
          ? {
              ...workspace,
              surveys: [...(workspace.surveys || []), action.payload],
            }
          : workspace
      );
    },
    deleteWorkspaceSurvey: (
      state,
      action: PayloadAction<{ surveyId: number; workspaceId: number }>
    ) => {
      const workspace = state.workspaces.find(
        (ws) => +ws.id === +action.payload.workspaceId
      );

      if (workspace && workspace.surveys) {
        const updatedSurveys = workspace.surveys.filter(
          (survey) => survey.id !== action.payload.surveyId
        );

        state.workspaces = state.workspaces.map((ws) =>
          +ws.id === +action.payload.workspaceId
            ? { ...ws, surveys: updatedSurveys }
            : ws
        );
      }
    },
    updateWorkspaceSurvey: (state, action: PayloadAction<SurveyModel>) => {
      const workspace = state.workspaces.find(
        (ws) => ws.id === action.payload.workspace
      );

      if (workspace && workspace.surveys) {
        const updatedSurveys = workspace.surveys.map((survey) =>
          survey.id === action.payload.id
            ? { ...survey, ...action.payload }
            : survey
        );

        state.workspaces = state.workspaces.map((ws) =>
          ws.id === workspace.id ? { ...ws, surveys: updatedSurveys } : ws
        );
      }
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

      const targetWorkspace = state.workspaces.find(
        (ws) => ws.id === targetWorkspaceId
      );

      if (sourceWorkspace && targetWorkspace) {
        // Ensure surveys are initialized
        sourceWorkspace.surveys = sourceWorkspace.surveys || [];
        targetWorkspace.surveys = targetWorkspace.surveys || [];

        const surveyToMove = sourceWorkspace.surveys.find(
          (survey) => survey.id === surveyId
        );

        if (surveyToMove) {
          // Remove from source workspace and add to target workspace
          sourceWorkspace.surveys = sourceWorkspace.surveys.filter(
            (survey) => survey.id !== surveyId
          );

          targetWorkspace.surveys.push(surveyToMove);

          // Update the state with modified workspaces
          state.workspaces = state.workspaces.map((workspace) => {
            if (workspace.id === sourceWorkspaceId) {
              return { ...workspace, surveys: [...sourceWorkspace.surveys] };
            }
            if (workspace.id === targetWorkspaceId) {
              return { ...workspace, surveys: [...targetWorkspace.surveys] };
            }
            return workspace;
          });
        }
      }
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
