import { translations } from "../components/lang/translations";
import { CustomError } from "../utils/CustomError";

export const addUserToGroup = async (
  groupId: number,
  groupName: string,
  username: string,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch("/api/group/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ username, groupId, groupName }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "addUserToGroup",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const removeUserFromGroup = async (
  groupId: number,
  userId: number,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch("/api/group/remove-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify({ userId, groupId }),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "removeUserFromGroup",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
