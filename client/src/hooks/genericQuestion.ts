import { GenericTextModel } from "../types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CustomError } from "../utils/CustomError";
import { translations } from "../components/lang/translations";
import {
  addQuestion,
  deleteQuestion,
  duplicateQuestion,
  editQuestion,
} from "../services/genericQuestion";

export const useAddQuestion = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    GenericTextModel,
    CustomError | unknown,
    {
      question: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      question,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await addQuestion(
        question,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (newQuestion: GenericTextModel) => {
      console.log("newQuestion", newQuestion);
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
    mutateAsync: handleAddQuestion,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddQuestion,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteQuestion = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      questionId: number;
    },
    CustomError | unknown,
    {
      questionId: number;
      workspaceAndSurvey: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      questionId,
      workspaceAndSurvey,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await deleteQuestion(
        questionId,
        workspaceAndSurvey,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (data: { questionId: number }) => {
      console.log("deleted", data.questionId);
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

export const useDuplicateQuestion = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      question: GenericTextModel;
    },
    CustomError | unknown,
    {
      questionId: number;
      workspaceAndSurvey: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      questionId,
      workspaceAndSurvey,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await duplicateQuestion(
        questionId,
        workspaceAndSurvey,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (data: { question: GenericTextModel }) => {
      console.log("duplicated", data.question);
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
    mutateAsync: handleDuplicateQuestion,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDuplicateQuestion,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useEditQuestion = () => {
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    {
      question: GenericTextModel;
    },
    CustomError | unknown,
    {
      questionId: number;
      questionData: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      questionId,
      questionData,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await editQuestion(
        questionId,
        questionData,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (data: { question: GenericTextModel }) => {
      console.log("edited", data.question);
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
    mutateAsync: handleEditQuestion,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleEditQuestion,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
