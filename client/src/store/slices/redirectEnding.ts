import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomEndingModel } from "../../types";

interface RedirectEndings {
  redirectUrl: string | null;
  urlLabel: string | null;
}

const initialState: RedirectEndings = {
  redirectUrl: null,
  urlLabel: null,
};

const redirectEndingSlice = createSlice({
  name: "redirectEnding",
  initialState,
  reducers: {
    setRedirectUrl: (state, action: PayloadAction<string | null>) => {
      state.redirectUrl = action.payload;
    },
    setUrlLabel: (state, action: PayloadAction<string | null>) => {
      state.urlLabel = action.payload;
    },
    resetRedirectEndingSliceFields: () => {
      return {
        ...initialState,
      };
    },
    modifyRedirectEndingSliceFields: (
      state,
      action: PayloadAction<Partial<CustomEndingModel>>
    ) => {
      return {
        ...state,
        redirectUrl: action.payload.redirectUrl || initialState.redirectUrl,
        urlLabel: action.payload.redirectUrl || initialState.urlLabel,
      };
    },
  },
});

export const {
  setRedirectUrl,
  setUrlLabel,
  resetRedirectEndingSliceFields,
  modifyRedirectEndingSliceFields,
} = redirectEndingSlice.actions;

export default redirectEndingSlice.reducer;
