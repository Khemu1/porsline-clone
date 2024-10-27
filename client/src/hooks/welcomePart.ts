import { WelcomePartModel } from "../types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CustomError } from "../utils/CustomError";
import { translations } from "../components/lang/translations";
import {
  addWelcomePart,
  deleteWelcomePart,
  editWelcomePart,
} from "../services/welcomePart";

export const useAddWelcomePart = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    WelcomePartModel,
    CustomError | unknown,
    {
      welcomePart: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      welcomePart,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await addWelcomePart(
        welcomePart,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
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
    mutateAsync: handleAddWelcomePart,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddWelcomePart,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
export const useDeleteWelcomePart = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      welcomePartId: number;
    },
    CustomError | unknown,
    {
      welcomePartId: number;
      serviceAndWorkspace: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      welcomePartId,
      serviceAndWorkspace,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await deleteWelcomePart(
        welcomePartId,
        serviceAndWorkspace,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async () => {
      // await deleteWelcomePartF(dispatch);
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
    mutateAsync: handleDeleteWelcomePart,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteWelcomePart,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useEditWelcomePart = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    WelcomePartModel,
    CustomError | unknown,
    {
      welcomePartId: number;
      welcomePart: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      welcomePartId,
      welcomePart,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await editWelcomePart(
        welcomePartId,
        welcomePart,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (newWelcomePart: WelcomePartModel) => {
      // await addWelcomePartF(newWelcomePart, dispatch);
      console.log("Survey created successfully:", newWelcomePart);
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
    mutateAsync: handleEditWelcomePart,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleEditWelcomePart,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
