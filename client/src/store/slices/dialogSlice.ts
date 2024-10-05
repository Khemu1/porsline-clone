import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogState {
  isDialogOpen: boolean;
  dialogType:
    | "edit"
    | "updateSurveyName"
    | "updateSurveyTitle"
    | "updateWorkspaceTitle"
    | "";
  surveyId: number | null;
  workspaceId: number | null;
}

const initialState: DialogState = {
  isDialogOpen: false,
  dialogType: "",
  workspaceId: null,
  surveyId: null,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openEditDialog(state) {
      state.isDialogOpen = true;
      state.dialogType = "edit";
    },
    openUpdateSurveyNameDialog(state, action: PayloadAction<number>) {
      console.log("openUpdateSurveyNameDialog");

      state.isDialogOpen = true;
      state.dialogType = "updateSurveyName";
      state.surveyId = action.payload;
    },

    openUpdateSurveyTitleDialog(state, action: PayloadAction<number>) {
      console.log("openUpdateSurveyTitleDialog");
      state.isDialogOpen = true;
      state.dialogType = "updateSurveyTitle";
      state.surveyId = action.payload;
    },

    openUpdateWorkspaceTitleDialog(state, action: PayloadAction<number>) {
      console.log("openUpdateWorkspaceTitleDialog");
      state.isDialogOpen = true;
      state.dialogType = "updateWorkspaceTitle";
      state.workspaceId = action.payload;
    },

    closeDialog(state) {
      console.log("closeDialog");
      state.isDialogOpen = false;
      state.dialogType = "";
      state.surveyId = null;
      state.workspaceId = null;
    },
  },
});

export const {
  openEditDialog,
  closeDialog,
  openUpdateSurveyNameDialog,
  openUpdateSurveyTitleDialog,
  openUpdateWorkspaceTitleDialog,
} = dialogSlice.actions;

export default dialogSlice.reducer;
