import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyModel } from "../../types";

interface SurveyState {
  surveys: SurveyModel[];
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
    updateSurveys: (state, action: PayloadAction<SurveyModel>) => {
      const index = state.surveys.findIndex(
        (survey) => survey.id === action.payload.id
      );
      if (index !== -1) {
        state.surveys[index] = action.payload; // Update the survey
      }
    },
    deleteSurvey: (state, action: PayloadAction<number>) => {
      state.surveys = state.surveys.filter(
        (survey) => survey.id !== action.payload
      );
    },
    addSurvey: (state, action: PayloadAction<SurveyModel>) => {
      state.surveys.push(action.payload);
    },
  },
});

export const { setSurveys, signOut, updateSurveys, deleteSurvey, addSurvey } =
  surveySlice.actions;
export default surveySlice.reducer;
