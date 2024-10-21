import { useDispatch } from "react-redux";
import { CustomEndingModel, DefaultEndingModel } from "../types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CustomError } from "../utils/CustomError";
import { translations } from "../components/lang/translations";
import { addNewEndingF, deleteEndingF, editEndingF } from "../utils";
import {
  addEnding,
  deleteEnding,
  duplicateEnding,
  editEnding,
} from "../services/ending";

export const useAddEnding = () => {
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      ending: CustomEndingModel | DefaultEndingModel;
      type: "custom" | "default";
      defaultEnding: boolean;
    },
    CustomError | unknown,
    {
      ending: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      ending,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await addEnding(
        ending,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (data: {
      ending: CustomEndingModel | DefaultEndingModel;
      type: "custom" | "default";
      defaultEnding: boolean;
    }) => {
      await addNewEndingF(data.ending, data.type, dispatch, data.defaultEnding);
      console.log("new ending", data.ending);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error creating new survey:", err);
    },
  });

  const {
    mutateAsync: handleAddEnding,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddEnding,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteEnding = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      endingId: number;
      type: "custom" | "default";
      defaultEnding: boolean;
    },
    CustomError | unknown,
    {
      endingId: number;
      ending: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      endingId,
      ending,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await deleteEnding(
        endingId,
        ending,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (data: {
      endingId: number;
      type: "custom" | "default";
    }) => {
      await deleteEndingF(
        data.endingId,

        data.type,
        dispatch
      );
      console.log("deleted");
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error creating new survey:", err);
    },
  });

  const {
    mutateAsync: handleDeleteEnding,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteEnding,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDuplicateEnding = () => {
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      ending: DefaultEndingModel | CustomEndingModel;
      type: "custom" | "default";
    },
    CustomError | unknown,
    {
      endingId: number;
      ending: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      endingId,
      ending,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await duplicateEnding(
        endingId,
        ending,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (data: {
      ending: CustomEndingModel | DefaultEndingModel;
      type: "custom" | "default";
    }) => {
      await addNewEndingF(data.ending, data.type, dispatch);
      console.log("duplicated");
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error creating new survey:", err);
    },
  });

  const {
    mutateAsync: handleDuplicateEnding,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDuplicateEnding,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useEditEnding = () => {
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      ending: DefaultEndingModel | CustomEndingModel;
      prevType: "custom" | "default";
      prevId: number;
    },
    CustomError | unknown,
    {
      endingId: number;
      endingData: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      endingId,
      endingData,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await editEnding(
        endingId,
        endingData,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (data: {
      ending: CustomEndingModel | DefaultEndingModel;
      prevType: "custom" | "default";
      prevId: number;
    }) => {
      await editEndingF(
        data.ending,
        data.prevType,
        data.prevId,
        dispatch,
        data.ending.defaultEnding
      );
      console.log("edited");
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error creating new survey:", err);
    },
  });

  const {
    mutateAsync: handleEditEnding,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleEditEnding,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
