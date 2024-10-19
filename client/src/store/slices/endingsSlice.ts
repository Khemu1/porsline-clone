import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomEndingModel, DefaultEndingModel } from "../../types";

interface EndingState {
  defaultEndings: DefaultEndingModel[];
  customEndings: CustomEndingModel[];
}

const initialState: EndingState = {
  defaultEndings: [],
  customEndings: [],
};

const endingSlice = createSlice({
  name: "endings",
  initialState,
  reducers: {
    setDefaultEndings: (state, action: PayloadAction<DefaultEndingModel[]>) => {
      state.defaultEndings = action.payload;
    },
    addDefaultEnding: (state, action: PayloadAction<DefaultEndingModel>) => {
      state.defaultEndings.push(action.payload);
    },
    updateDefaultEnding: (state, action: PayloadAction<DefaultEndingModel>) => {
      const index = state.defaultEndings.findIndex(
        (ending) => ending.id === action.payload.id
      );
      if (index !== -1) {
        state.defaultEndings[index] = action.payload;
      }
    },
    deleteDefaultEnding: (state, action: PayloadAction<number>) => {
      state.defaultEndings = state.defaultEndings.filter(
        (ending) => +ending.id !== +action.payload
      );
    },
    deleteCustomEnding: (state, action: PayloadAction<number>) => {
      state.customEndings = state.customEndings.filter(
        (ending) => +ending.id !== +action.payload
      );
    },
    setCustomEndings: (state, action: PayloadAction<CustomEndingModel[]>) => {
      state.customEndings = action.payload;
    },
    addCustomEnding: (state, action: PayloadAction<CustomEndingModel>) => {
      state.customEndings.push(action.payload);
    },
    updateCustomEnding: (state, action: PayloadAction<CustomEndingModel>) => {
      const index = state.customEndings.findIndex(
        (ending) => ending.id === action.payload.id
      );
      if (index !== -1) {
        state.customEndings[index] = action.payload;
      }
    },
    setDefaultEnding: (
      state,
      action: PayloadAction<{ id: number; type: "default" | "custom" }>
    ) => {
      const { id, type } = action.payload;

      state.defaultEndings.forEach((ending) => {
        ending.defaultEnding = false;
      });
      state.customEndings.forEach((ending) => {
        ending.defaultEnding = false;
      });

      if (type === "default") {
        const defaultEnding = state.defaultEndings.find(
          (ending) => ending.id === id
        );
        if (defaultEnding) {
          defaultEnding.defaultEnding = true;
        }
      } else if (type === "custom") {
        const customEnding = state.customEndings.find(
          (ending) => ending.id === id
        );
        if (customEnding) {
          customEnding.defaultEnding = true;
        }
      }
    },
  },
});

export const {
  setDefaultEndings,
  addDefaultEnding,
  updateDefaultEnding,
  deleteDefaultEnding,
  setCustomEndings,
  addCustomEnding,
  updateCustomEnding,
  deleteCustomEnding,
  setDefaultEnding,
} = endingSlice.actions;

export default endingSlice.reducer;
