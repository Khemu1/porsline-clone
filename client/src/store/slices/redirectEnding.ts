import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RedirectEndings {
  redirectTo: string | null;
  urlLabel: string | null;
}

const initialState: RedirectEndings = {
  redirectTo: null,
  urlLabel: null,
};

const redirectEndingSlice = createSlice({
  name: "redirectEnding",
  initialState,
  reducers: {
    setRedirectTo: (state, action: PayloadAction<string | null>) => {
      state.redirectTo = action.payload;
    },
    setUrlLabel: (state, action: PayloadAction<string | null>) => {
      state.urlLabel = action.payload;
    },
    clearRedirectEndingFields: (state) => {
      state.redirectTo = null;
      state.urlLabel = null;
    },
  },
});

export const { setRedirectTo, setUrlLabel, clearRedirectEndingFields } =
  redirectEndingSlice.actions;  

export default redirectEndingSlice.reducer; 
