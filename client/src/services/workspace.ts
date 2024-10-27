import { translations } from "../components/lang/translations";
import { WorkSpaceModel } from "../types";
import { CustomError } from "../utils/CustomError";

export const getWorkspaces = async (): Promise<WorkSpaceModel[]> => {
  try {
    const response = await fetch("/api/workspace/get-workspaces", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();
      const err = new CustomError(
        errorData.message || "Sign-in failed",
        response.status,
        "SignInError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: WorkSpaceModel[] = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const createNewWorkspace = async (
  title: string,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<WorkSpaceModel> => {
  try {
    const response = await fetch(`/api/workspace/add-workspace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "addWorkspaceError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateWorkspaceTitle = async (
  WorkspaceId: number,
  title: string,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<{ title: string }> => {
  try {
    const response = await fetch(`/api/workspace/${WorkspaceId}/update-title`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "addWorkspaceError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteWorkspace = async (
  WorkspaceId: number,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<void> => {
  try {
    const response = await fetch(`/api/workspace/${WorkspaceId}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "addWorkspaceError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }
    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
