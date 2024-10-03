import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyModel } from "../../types";

interface SurveyState {
  surveys: SurveyModel[] | [];
}

const initialState: SurveyState = {
  surveys: [],
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setSurveys: (state, action: PayloadAction<SurveyModel[]>) => {
      state.surveys = action.payload; // Set the entire array of surveys
    },
    signOut: (state) => {
      state.surveys = []; // Reset surveys on sign out
    },
  },
});

export const { setSurveys, signOut } = surveySlice.actions;
export default surveySlice.reducer;
