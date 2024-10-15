import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WelcomePartModel } from "../../types";

interface WelcomePartState {
  id: number | null;
  surveyId: number | null;
  label: string | null;
  description?: string | null;
  imageUrl?: string | null;
  buttonText?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

const initialState: WelcomePartState = {
  id: null,
  surveyId: null,
  label: null,
  description: null,
  imageUrl: null,
  buttonText: null,
  createdAt: null,
  updatedAt: null,
};

const welcomePartSlice = createSlice({
  name: "welcomePart",
  initialState,
  reducers: {
    updateWelcomePart: (
      state,
      action: PayloadAction<Partial<WelcomePartModel>>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetWelcomePart: () => initialState,
  },
});

export const { updateWelcomePart, resetWelcomePart } = welcomePartSlice.actions;

export default welcomePartSlice.reducer;
