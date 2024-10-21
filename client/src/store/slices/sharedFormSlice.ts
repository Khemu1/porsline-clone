// sharedFormSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultEndingModel, GenericTextModel, WelcomePartModel } from "../../types";

interface SharedFormState {
  label: string;
  description: string;
  isSubmitting: boolean;
  fileImage: FileImage | null;
  isRequired: boolean;
  defaultEnding: boolean;
  hideQuestionNumber: boolean;
  isImageUploadEnabled: boolean;
  isDescriptionEnabled: boolean;
  previewImageUrl?: string;
}

interface FileImage {
  fileType: string | null;
  fileSize: number | null;
}

const initialState: SharedFormState = {
  label: "",
  description: "",
  isSubmitting: false,
  fileImage: null,
  isRequired: false,
  hideQuestionNumber: false,
  isImageUploadEnabled: false,
  isDescriptionEnabled: false,
  previewImageUrl: undefined,
  defaultEnding: false,
};

const sharedFormSlice = createSlice({
  name: "sharedForm",
  initialState,
  reducers: {
    setLabel: (state, action: PayloadAction<string>) => {
      state.label = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setImageFile: (
      state,
      action: PayloadAction<{
        fileType: string | undefined;
        fileSize: number | undefined;
      }>
    ) => {
      const fileImage: FileImage = {
        fileType: action.payload.fileType ?? null,
        fileSize: action.payload.fileSize ?? null,
      };
      state.fileImage = fileImage; // Update state with the new FileImage
    },
    setIsImageUploadEnabled: (state, action: PayloadAction<boolean>) => {
      state.isImageUploadEnabled = action.payload;
    },
    setIsDescriptionEnabled: (state, action: PayloadAction<boolean>) => {
      state.isDescriptionEnabled = action.payload;
    },
    setPreviewImageUrl: (state, action: PayloadAction<string | undefined>) => {
      state.previewImageUrl = action.payload;
    },
    setDefaultEnding: (state, action: PayloadAction<boolean>) => {
      state.defaultEnding = action.payload;
    },
    resetSharedFormSliceFields: () => {
      return {
        ...initialState,
      };
    },
    modifySharedFormSliceFields: (
      state,
      action: PayloadAction<Partial<WelcomePartModel|GenericTextModel|DefaultEndingModel>>
    ) => {
      return {
        ...state,
        isImageUploadEnabled: action.payload.imageUrl
          ? true
          : initialState.isImageUploadEnabled,
        isDescriptionEnabled: action.payload.description
          ? true
          : initialState.isDescriptionEnabled,
        label: action.payload.label || initialState.label,
        description: action.payload.description || initialState.description,
        previewImageUrl:
          action.payload.imageUrl || initialState.previewImageUrl,
      };
    },
  },
});

export const {
  setLabel,
  setDescription,
  setIsSubmitting,
  setImageFile,
  setIsImageUploadEnabled,
  setIsDescriptionEnabled,
  setPreviewImageUrl,
  setDefaultEnding,
  resetSharedFormSliceFields,
  modifySharedFormSliceFields,
} = sharedFormSlice.actions;

export default sharedFormSlice.reducer;
