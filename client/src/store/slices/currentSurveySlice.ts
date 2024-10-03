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
  },
});

export const { setCurrentSurvey, clearCurrentSurvey } =
  currentSurveySlice.actions;
export default currentSurveySlice.reducer;
