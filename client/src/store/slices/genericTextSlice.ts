// genericTextSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GenericTextState {
  isRequired: boolean;
  hideQuestionNumber: boolean;
  minLength: string | number;
  maxLength: string | number;
  regex: string;
  regexPlaceHolder: string;
  regexErrorMessage: string;
  answerFormat: string;
}

const initialState: GenericTextState = {
  isRequired: false,
  hideQuestionNumber: false,
  minLength: 0,
  maxLength: 1,
  regex: "",
  regexPlaceHolder: "",
  regexErrorMessage: "",
  answerFormat: "text",
};

const genericTextSlice = createSlice({
  name: "genericText",
  initialState,
  reducers: {
    setIsRequired: (state, action: PayloadAction<boolean>) => {
      state.isRequired = action.payload;
    },
    setHideQuestionNumber: (state, action: PayloadAction<boolean>) => {
      state.hideQuestionNumber = action.payload;
    },
    setMinLength: (state, action: PayloadAction<string | number>) => {
      state.minLength = action.payload;
    },
    setMaxLength: (state, action: PayloadAction<string | number>) => {
      state.maxLength = action.payload;
    },
    setRegex: (state, action: PayloadAction<string>) => {
      state.regex = action.payload;
    },
    setRegexPlaceHolder: (state, action: PayloadAction<string>) => {
      state.regexPlaceHolder = action.payload;
    },
    setRegexErrorMessage: (state, action: PayloadAction<string>) => {
      state.regexErrorMessage = action.payload;
    },
    setAnswerFormat: (state, action: PayloadAction<string>) => {
      state.answerFormat = action.payload;
    },
  },
});

export const {
  setIsRequired,
  setHideQuestionNumber,
  setMinLength,
  setMaxLength,
  setRegex,
  setRegexPlaceHolder,
  setRegexErrorMessage,
  setAnswerFormat,
} = genericTextSlice.actions;

export default genericTextSlice.reducer;
