import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyModel } from "../../types";

interface CurrentSurveyState {
  currentSurvey: SurveyModel | null;
}

const initialState: CurrentSurveyState = {
  currentSurvey: null,
};

const currentSurveySlice = createSlice({
  name: "currentSurvey",
  initialState,
  reducers: {
    setCurrentSurvey: (state, action: PayloadAction<SurveyModel>) => {
      state.currentSurvey = action.payload;
    },
    clearCurrentSurvey: (state) => {
      state.currentSurvey = null;
    },
    updateCurrentSurvey: (state, action: PayloadAction<SurveyModel>) => {
      if (state.currentSurvey?.id === action.payload.id) {
        state.currentSurvey = action.payload; // Update current survey
      }
    },
  },
});

export const { setCurrentSurvey, clearCurrentSurvey, updateCurrentSurvey } =
  currentSurveySlice.actions;
export default currentSurveySlice.reducer;
