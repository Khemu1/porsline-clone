import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkSpaceModel } from "../../types";

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
      state.currentWorkspace = action.payload;
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
    },
    updateCurrentWorkspace: (state, action: PayloadAction<WorkSpaceModel>) => {
      state.currentWorkspace = { ...state.currentWorkspace, ...action.payload };
    },
  },
});

export const {
  setCurrentWorkspace,
  clearCurrentWorkspace,
  updateCurrentWorkspace,
} = currentWorkspaceSlice.actions;
export default currentWorkspaceSlice.reducer;
