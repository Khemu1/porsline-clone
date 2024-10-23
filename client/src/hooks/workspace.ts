import { useCallback, useState } from "react";
import { WorkSpaceModel } from "../types";
import {
  createNewWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspaceTitle,
} from "../services/workspace";
import { CustomError } from "../utils/CustomError";

import { useMutation } from "@tanstack/react-query";
import { translations } from "../components/lang/translations";

export const useGetWorkspaces = () => {
  const [data, setData] = useState<[] | WorkSpaceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleGetWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await getWorkspaces());
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        if (err.errors) {
          setError(err.errors);
        } else {
          setError({
            message: err.message,
          });
        }
      } else {
        setError({
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);
  return { handleGetWorkspaces, data, loading, error, success };
};

export const useUpdateWorkspaceTitle = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    { title: string },
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
    }: {
      title: string;
      workspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }) => {
      return await updateWorkspaceTitle(
        workspaceId,
        title,
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
  });

  const {
    mutateAsync: handleUpdateWorkspaceTitle,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleUpdateWorkspaceTitle,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useDeleteWorkspace = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    void,
    CustomError | unknown,
    {
      workspaceId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      workspaceId,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      await deleteWorkspace(
        workspaceId,
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
    mutateAsync: handleDeleteWorkspace,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleDeleteWorkspace,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useCreateWorkspace = () => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const mutation = useMutation<
    WorkSpaceModel,
    CustomError | unknown,
    {
      title: string;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      title,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await createNewWorkspace(
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
    mutateAsync: handleCreateWorkspace,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleCreateWorkspace,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
