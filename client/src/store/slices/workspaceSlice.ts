import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkSpaceModel } from "../../types";

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
  },
});

export const {
  setWorkspaces,
  signOut,
  updateWorkspace,
  deleteWorkspace,
  addWorkspace,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
