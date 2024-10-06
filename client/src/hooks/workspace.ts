import { useCallback, useState } from "react";
import { WorkSpaceModel } from "../types";
import {
  createNewWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspaceTitle,
} from "../services/workspace";
import { CustomError } from "../utils/CustomError";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { translations } from "../components/lang/translations";
import {
  addNewWorkspaceF,
  deleteWorkspaceF,
  updateWorkspaceTitleF,
} from "../utils";
import { useMutation } from "@tanstack/react-query";

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
  const dispatch = useDispatch();
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
    onSuccess: async (data: { title: string }) => {
      await updateWorkspaceTitleF(
        data.title,
        workspaces,
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
  const dispatch = useDispatch();
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
    onSuccess: async () => {
      console.log("Survey deleted successfully");
      await deleteWorkspaceF(workspaces, currentWorkspace!, dispatch);
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
  const dispatch = useDispatch();
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
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
    onSuccess: async (newWorkspace: WorkSpaceModel) => {
      await addNewWorkspaceF(newWorkspace, workspaces, dispatch);
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
