import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericTextModel } from "../../types";

const initialState: GenericTextModel[] = [];

const genericTextSlice = createSlice({
  name: "genericTexts",
  initialState,
  reducers: {
    addGenericText: (state, action: PayloadAction<GenericTextModel>) => {
      state.push(action.payload);
    },

    updateGenericText: (state, action: PayloadAction<GenericTextModel>) => {
      const index = state.findIndex((text) => text.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },

    removeGenericText: (state, action: PayloadAction<number>) => {
      return state.filter((text) => +text.id !== +action.payload);
    },

    setGenericTexts: (state, action: PayloadAction<GenericTextModel[]>) => {
      return action.payload;
    },
  },
});

export const {
  addGenericText,
  updateGenericText,
  removeGenericText,
  setGenericTexts,
} = genericTextSlice.actions;

export default genericTextSlice.reducer;
