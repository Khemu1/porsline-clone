import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  duplicateSurvey,
  moveSurveyToWorkspace,
  updateSurveyStatus,
  updateSurveyTitle,
} from "../services/survey";
import { useState } from "react";
import {
  SurveyModel,
  UpdateSurveyStatusResponse,
  UpdateSurveyTitleProps,
  UpdateSurveyTitleResponse,
} from "../types";
import { CustomError } from "../utils/CustomError";
import { RootState } from "../store/store";
import {
  clearCurrentSurvey,
  setCurrentSurvey,
} from "../store/slices/currentSurveySlice";
import { setSurveys } from "../store/slices/surveySlice";
import { setWorkspaces } from "../store/slices/workspaceSlice";
import { translations } from "../components/lang/translations";
import {
  clearCurrentWorkspace,
  setCurrentWorkspace,
} from "../store/slices/currentWorkspaceSlice";

export const useUpdateSurvey = () => {
  const dispatch = useDispatch();
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const surveys = useSelector((state: RootState) => state.survey.surveys);
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
    }: UpdateSurveyTitleProps) => {
      const response = await updateSurveyTitle(
        title,
        workspaceId,
        surveyId,
        getCurrentLanguageTranslations
      );
      return response;
    },
    onSuccess: (data: UpdateSurveyTitleResponse) => {
      const updatedSurvey = {
        ...currentSurvey,
        title: data.title,
        updatedAt: data.updatedAt,
      };

      dispatch(setCurrentSurvey(updatedSurvey as SurveyModel));
      const newSurveys = surveys.map((survey) => {
        if (survey.id === updatedSurvey.id) {
          return {
            ...survey,
            title: updatedSurvey.title,
            updatedAt: updatedSurvey.updatedAt,
          };
        }
        return survey;
      });

      dispatch(setSurveys(newSurveys));
      setErrorState(null);

      console.log("Updated Survey dispatched:", updatedSurvey);
    },

    onError: (err: CustomError | unknown) => {
      if (err instanceof CustomError) {
        if (err.errors) {
          setErrorState(err.errors);
        } else {
          setErrorState({ message: err.message });
        }
      } else {
        setErrorState({ message: "Unknown  Error" });
      }

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
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
    }
  >({
    mutationFn: async ({
      title,
      workspaceId,
      surveyId,
      getCurrentLanguageTranslations,
    }) => {
      const response = await duplicateSurvey(
        title,
        workspaceId,
        surveyId,
        getCurrentLanguageTranslations
      );
      return response;
    },
    onSuccess: (data: SurveyModel) => {
      dispatch(setSurveys([...surveys, data]));
      console.log("Survey duplicated successfully:", data);
    },
    onError: (err: CustomError | unknown) => {
      if (err instanceof CustomError) {
        if (err.errors) {
          setErrorState(err.errors);
        } else {
          setErrorState({ message: err.message });
        }
      } else {
        setErrorState({ message: "Unknown Error" });
      }

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
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );
  const mutation = useMutation<
    { targetWorkspaceId: number },
    unknown,
    {
      workspaceId: number;
      surveyId: number;
      targetWorkspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
    }
  >({
    mutationFn: async ({
      workspaceId,
      surveyId,
      targetWorkspaceId,
      getCurrentLanguageTranslations,
    }: {
      workspaceId: number;
      surveyId: number;
      targetWorkspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
    }) => {
      const response = await moveSurveyToWorkspace(
        workspaceId,
        surveyId,
        targetWorkspaceId,
        getCurrentLanguageTranslations
      );
      return response;
    },

    onSuccess: (data: { targetWorkspaceId: number }) => {
      const currentSur = currentSurvey;
      dispatch(clearCurrentSurvey());
      /**
       * Remove the survey from the current workspace
       * Add the survey to the new workspace
       * Update the current workspace
       * Update the surveys in the new workspace
       * Update the workspaces
       */

      const updatedSurveys = surveys.filter(
        (survey) => survey.id !== currentSur!.id
      );
      dispatch(setSurveys(updatedSurveys));
      
      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace.id === currentSur!.workspace) {
          return {
            ...workspace,
            surveys: workspace.surveys.filter(
              (survey) => survey.id !== currentSur!.id
            ),
          };
        }
        // 1 done

        if (workspace.id === data.targetWorkspaceId) {
          return {
            ...workspace,
            surveys: [
              ...workspace.surveys,
              { ...currentSur!, workspaceId: data.targetWorkspaceId },
            ],
          };
        }
        return workspace;
      });

      dispatch(setWorkspaces(updatedWorkspaces));

      if (currentSur!.workspace !== data.targetWorkspaceId) {
        const newWorkspace = updatedWorkspaces.filter(
          (workspace) => workspace.id == data.targetWorkspaceId
        );
        if (newWorkspace) {
          dispatch(setCurrentWorkspace(newWorkspace));
        }
      }

      console.log("Survey moved successfully:", data);
    },

    onError: (err: CustomError | unknown) => {
      if (err instanceof CustomError) {
        if (err.errors) {
          setErrorState(err.errors);
        } else {
          setErrorState({ message: err.message });
        }
      } else {
        setErrorState({ message: "Unknown  Error" });
      }

      console.error("Error updating survey title:", err);
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
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );
  const mutation = useMutation<
    UpdateSurveyStatusResponse,
    unknown,
    {
      surveyId: number;
      workspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
    }
  >({
    mutationFn: async ({
      surveyId,
      workspaceId,
      getCurrentLanguageTranslations,
    }) => {
      const response = await updateSurveyStatus(
        workspaceId,
        surveyId,
        getCurrentLanguageTranslations
      );
      return response;
    },
    onSuccess: (data: UpdateSurveyStatusResponse) => {
      const updatedCurrentSurvey = {
        ...currentSurvey!,
        isActive: data.isActive,
      };
      dispatch(setCurrentSurvey(updatedCurrentSurvey));

      const updatedSurveys = surveys.map((survey) =>
        survey.id === currentSurvey!.id
          ? { ...survey, isActive: data.isActive }
          : survey
      );
      dispatch(setSurveys(updatedSurveys));
      console.log("Survey status updated successfully:", data);
    },
    onError: (err: CustomError | unknown) => {
      if (err instanceof CustomError) {
        if (err.errors) {
          setErrorState(err.errors);
        } else {
          setErrorState({ message: err.message });
        }
      } else {
        setErrorState({ message: "Unknown Error" });
      }

      console.error("Error updating survey title:", err);
    },
  });

  const {
    mutateAsync: hundleUpdateSurveyStatus,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    hundleUpdateSurveyStatus,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
