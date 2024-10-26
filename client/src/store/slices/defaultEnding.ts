import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultEndingModel } from "../../types";

interface DefaultEndings {
  shareSurvey: boolean;
  reloadOrRedirect: boolean;
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
  reloadOrRedirect: false,
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
    setReloadOrRedirect: (state, action: PayloadAction<boolean>) => {
      state.reloadOrRedirect = action.payload;
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
    resetDefaultEndingSliceFields: () => {
      return {
        ...initialState,
      };
    },
    modifyDefaultEndingSliceFields: (
      state,
      action: PayloadAction<Partial<DefaultEndingModel>>
    ) => {
      console.log(
        "in slice",
        action.payload.redirectToWhat,
        [
          "Results Link",
          "Another Link",
          "Survey Link (Reaload the Survey)",
        ].includes(action.payload.redirectToWhat as string)
      );
      return {
        ...state,
        shareSurvey: action.payload.shareSurvey ?? initialState.shareSurvey,
        buttonText: action.payload.buttonText ?? initialState.buttonText,
        anotherLink: action.payload.anotherLink ?? initialState.anotherLink,
        autoReload: action.payload.autoReload ?? initialState.autoReload,
        reloadTimeInSeconds:
          action.payload.reloadTimeInSeconds ??
          initialState.reloadTimeInSeconds,
        redirectToWhat:
          action.payload.redirectToWhat &&
          [
            "Results Link",
            "Another Link",
            "Survey Link (Reaload the Survey)",
          ].includes(action.payload.redirectToWhat)
            ? action.payload.redirectToWhat
            : initialState.redirectToWhat,
        reloadOrRedirect:
          action.payload.reloadOrRedirect ?? initialState.reloadOrRedirect,
      };
    },
  },
});

export const {
  setShareSurvey,
  setReloadOrRedirect,
  setButtonText,
  setAutoReload,
  setReloadTimeInSeconds,
  setRedirectToWhat,
  setAnotherLink,
  resetDefaultEndingSliceFields,
  modifyDefaultEndingSliceFields,
} = defaultEndingSlice.actions;

export default defaultEndingSlice.reducer;
