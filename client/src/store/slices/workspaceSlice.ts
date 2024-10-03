import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkSpaceModel } from "../../types";

interface WorkspaceState {
  workspaces: WorkSpaceModel[] | []; // Declare the state properly
}

const initialState: WorkspaceState = {
  workspaces: [],
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<WorkSpaceModel[]>) => {
      state.workspaces = action.payload; // Set the entire array of workspaces
    },
    signOut: (state) => {
      state.workspaces = []; // Reset workspaces on sign out
    },
  },
});

export const { setWorkspaces, signOut } = workspaceSlice.actions;
export default workspaceSlice.reducer;
