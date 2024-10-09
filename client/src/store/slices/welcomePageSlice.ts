// welcomePageSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  },
});

export const { setButtonText, setIsButtonEnabled, setIsLabelEnabled } =
  welcomePageSlice.actions;

export default welcomePageSlice.reducer;
