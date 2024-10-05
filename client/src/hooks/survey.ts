import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewSurvey,
  deleteSurveyFromWorkspace,
  duplicateSurvey,
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
import { RootState } from "../store/store";
import { translations } from "../components/lang/translations";
import {
  addSurvey,
  deleteSurvey,
  duplicateSurveyF,
  moveSurveyF,
  toggleSurveyActiveF,
  updateSurveyTitleF,
} from "../utils";

export const useUpdateSurvey = () => {
  const dispatch = useDispatch();
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const surveys = useSelector((state: RootState) => state.survey.surveys);
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

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
    onSuccess: async (data: UpdateSurveyTitleResponse) => {
      await updateSurveyTitleF(
        data,
        currentSurvey!.id,
        workspaces,
        surveys,
        currentWorkspace!,
        dispatch
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
  const dispatch = useDispatch();
  const surveys = useSelector((state: RootState) => state.survey.surveys);
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

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
    onSuccess: async (data: SurveyModel) => {
      await duplicateSurveyF(
        data,
        data.workspace,
        workspaces,
        surveys,
        currentWorkspace!,
        dispatch
      );
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
  const dispatch = useDispatch();
  const surveys = useSelector((state: RootState) => state.survey.surveys);
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

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
    onSuccess: async ({ targetWorkspaceId: number }) => {
      await moveSurveyF(
        currentSurvey!.id,
        number,
        workspaces,
        surveys,
        currentWorkspace!,
        dispatch
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
  const dispatch = useDispatch();
  const surveys = useSelector((state: RootState) => state.survey.surveys);
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

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
    onSuccess: async () => {
      await toggleSurveyActiveF(
        currentSurvey!.id,
        workspaces,
        surveys,
        currentWorkspace!,
        dispatch
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
  const dispatch = useDispatch();
  const surveys = useSelector((state: RootState) => state.survey.surveys);
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

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
    onSuccess: async () => {
      console.log("Survey deleted successfully");
      await deleteSurvey(
        currentSurvey!.id,
        workspaces,
        surveys,
        currentWorkspace!,
        dispatch
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
  const dispatch = useDispatch();
  const surveys = useSelector((state: RootState) => state.survey.surveys);
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
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
    onSuccess: async (newSurvey: SurveyModel) => {
      await addSurvey(
        newSurvey,
        workspaces,
        surveys,
        currentWorkspace!,
        dispatch
      );
      console.log("Survey created successfully:", newSurvey);
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
