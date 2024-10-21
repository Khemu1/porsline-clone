// welcomePageSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WelcomePartModel } from "../../types";

interface WelcomePageState {
  buttonText: string;
  isButtonEnabled: boolean;
  isLabelEnabled: boolean;
}

const initialState: WelcomePageState = {
  buttonText: "",
  isButtonEnabled: true,
  isLabelEnabled: true,
};

const welcomePageSlice = createSlice({
  name: "welcomePage",
  initialState,
  reducers: {
    setButtonText: (state, action: PayloadAction<string>) => {
      state.buttonText = action.payload;
    },
    setIsButtonEnabled: (state, action: PayloadAction<boolean>) => {
      state.isButtonEnabled = action.payload;
    },
    setIsLabelEnabled: (state, action: PayloadAction<boolean>) => {
      state.isLabelEnabled = action.payload;
    },
    resetWelcomePartSliceFields: () => {
      return {
        ...initialState,
      };
    },
    modifyWelcomePartSliceFields: (
      state,
      action: PayloadAction<Partial<WelcomePartModel>>
    ) => {
      return {
        ...state,
        isLabelEnabled: action.payload.label
          ? true
          : initialState.isLabelEnabled,
        isButtonEnabled: action.payload.buttonText
          ? true
          : initialState.isButtonEnabled,
        buttonText: action.payload.buttonText || initialState.buttonText,
      };
    },
  },
});

export const {
  setButtonText,
  setIsButtonEnabled,
  setIsLabelEnabled,
  resetWelcomePartSliceFields,
  modifyWelcomePartSliceFields,
} = welcomePageSlice.actions;

export default welcomePageSlice.reducer;
