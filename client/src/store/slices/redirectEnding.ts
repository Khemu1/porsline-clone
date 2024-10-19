import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    clearRedirectEndingFields: (state) => {
      state.redirectUrl = null;
      state.urlLabel = null;
    },
  },
});

export const { setRedirectUrl, setUrlLabel, clearRedirectEndingFields } =
  redirectEndingSlice.actions;  

export default redirectEndingSlice.reducer; 
