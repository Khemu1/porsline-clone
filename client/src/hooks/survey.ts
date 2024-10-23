import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createNewSurvey,
  deleteSurveyFromWorkspace,
  duplicateSurvey,
  getSurvey,
  moveSurveyToWorkspace,
  updateSurveyStatus,
  updateSurveyTitle,
} from "../services/survey";
import { useState } from "react";
import {
  SurveyModel,
  UpdateSurveyTitleProps,
  UpdateSurveyTitleResponse,
} from "../types";
import { CustomError } from "../utils/CustomError";
import { translations } from "../components/lang/translations";


export const useUpdateSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    UpdateSurveyTitleResponse,
    CustomError | unknown,
    UpdateSurveyTitleProps
  >({
    mutationFn: async ({
      title,
      workspaceId,
      surveyId,
      getCurrentLanguageTranslations,
      currentLang,
    }: UpdateSurveyTitleProps) => {
      return await updateSurveyTitle(
        title,
        workspaceId,
        surveyId,
        getCurrentLanguageTranslations,
        currentLang
      );
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };

      setErrorState(message);
      console.error("Error updating survey title:", err);
    },
    onSettled: () => {
      console.log("Mutation has either succeeded or failed");
    },
  });

  const {
    mutateAsync: handleUpdateSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDuplicateSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    unknown,
    {
      title: string;
      workspaceId: number;
      surveyId: number;
      targetWorkspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      title,
      workspaceId,
      surveyId,
      targetWorkspaceId,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await duplicateSurvey(
        title,
        workspaceId,
        surveyId,
        targetWorkspaceId,
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
      console.error("Error duplicating survey:", err);
    },
  });

  const { mutateAsync: handleDuplicateSurvey, isError, isSuccess } = mutation;

  return {
    handleDuplicateSurvey,
    isError,
    isSuccess,
    errorState,
  };
};

export const useMoveSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { targetWorkspaceId: number },
    CustomError | unknown,
    {
      workspaceId: number;
      surveyId: number;
      targetWorkspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
      targetWorkspaceId,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      return await moveSurveyToWorkspace(
        workspaceId,
        surveyId,
        targetWorkspaceId,
        getCurrentLanguageTranslations,
        currentLang
      );
    },

    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error moving survey:", err);
    },
  });

  const {
    mutateAsync: handleMoveSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleMoveSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useChangeSurveyStatus = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    void,
    CustomError | unknown,
    {
      surveyId: number;
      workspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      surveyId,
      workspaceId,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      return await updateSurveyStatus(
        workspaceId,
        surveyId,
        getCurrentLanguageTranslations,
        currentLang
      );
    },

    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error moving survey:", err);
    },
  });

  const {
    mutateAsync: handleUpdateSurveyStatus,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateSurveyStatus,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    void,
    CustomError | unknown,
    {
      surveyId: number;
      workspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      surveyId,
      workspaceId,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      await deleteSurveyFromWorkspace(
        workspaceId,
        surveyId,
        getCurrentLanguageTranslations,
        currentLang
      );
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error deleting survey:", err);
    },
  });

  const {
    mutateAsync: handleDeleteSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useCreateSurvey = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    SurveyModel,
    CustomError | unknown,
    {
      title: string;
      workspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      title,
      workspaceId,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await createNewSurvey(
        workspaceId,
        title,
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
    mutateAsync: handleCreateSurvey,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleCreateSurvey,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useGetSurvey = (
  workspaceId: number,
  surveyId: number,
  getCurrentLanguageTranslations: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const {
    data: survey,
    isError,
    isLoading,
  } = useQuery<SurveyModel, CustomError>({
    queryKey: ["getSurvey", workspaceId, surveyId],
    queryFn: async () => {
      try {
        const survey = await getSurvey(
          workspaceId,
          surveyId,
          getCurrentLanguageTranslations,
          currentLang
        );
        return survey;
      } catch (error) {
        const message =
          error instanceof CustomError
            ? error.errors || { message: error.message }
            : { message: "Unknown Error" };
        setErrorState(message);
        throw error;
      }
    },
  });

  return { survey, isError, isLoading, errorState };
};
