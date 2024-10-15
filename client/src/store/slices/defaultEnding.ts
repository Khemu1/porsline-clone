import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DefaultEndings {
  shareSurvey: boolean;
  ReloadOrDirectButton: boolean;
  buttonText: string;
  redirectToWhat:
    | "Results Link"
    | "Another Link"
    | "Survey Link (Reaload the Survey)";
  anotherLink: string | null;
  autoReload: boolean;
  reloadTimeInSeconds: number;
}

const initialState: DefaultEndings = {
  shareSurvey: false,
  ReloadOrDirectButton: false,
  buttonText: "",
  autoReload: false,
  reloadTimeInSeconds: 10,
  redirectToWhat: "Survey Link (Reaload the Survey)",
  anotherLink: null,
};

const defaultEndingSlice = createSlice({
  name: "defaultEnding",
  initialState,
  reducers: {
    setShareSurvey: (state, action: PayloadAction<boolean>) => {
      state.shareSurvey = action.payload;
    },
    setReloadOrDirectButton: (state, action: PayloadAction<boolean>) => {
      state.ReloadOrDirectButton = action.payload;
    },
    setButtonText: (state, action: PayloadAction<string>) => {
      state.buttonText = action.payload;
    },

    setAutoReload: (state, action: PayloadAction<boolean>) => {
      state.autoReload = action.payload;
    },
    setReloadTimeInSeconds: (state, action: PayloadAction<number>) => {
      state.reloadTimeInSeconds = action.payload;
    },
    setRedirectToWhat: (
      state,
      action: PayloadAction<
        "Results Link" | "Another Link" | "Survey Link (Reaload the Survey)"
      >
    ) => {
      state.redirectToWhat = action.payload;
    },
    setAnotherLink: (state, action: PayloadAction<string>) => {
      state.anotherLink = action.payload;
    },
    clearDefaultEndingFields: (state) => {
      state.shareSurvey = false;
      state.ReloadOrDirectButton = false;
      state.buttonText = "";
      state.autoReload = false;
      state.reloadTimeInSeconds = 10;
      state.redirectToWhat = "Survey Link (Reaload the Survey)";
      state.anotherLink = null;
    },
  },
});

export const {
  setShareSurvey,
  setReloadOrDirectButton,
  setButtonText,
  setAutoReload,
  setReloadTimeInSeconds,
  setRedirectToWhat,
  setAnotherLink,
  clearDefaultEndingFields,
} = defaultEndingSlice.actions;

export default defaultEndingSlice.reducer;
