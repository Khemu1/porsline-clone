import { translations } from "../components/lang/translations";
import { CustomError } from "../utils/CustomError";

export const addEnding = async (
  ending: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/ending/add`, {
      method: "POST",
      headers: {
        "Accept-Language": currentLang,
      },
      body: ending,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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

export const deleteEnding = async (
  endingId: number,
  worksapceAndSurvey: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/ending/delete/${endingId}`, {
      method: "DELETE",
      headers: {
        "Accept-Language": currentLang,
      },
      body: worksapceAndSurvey,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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

export const duplicateEnding = async (
  endingId: number,
  worksapceAndSurvey: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/ending/duplicate/${endingId}`, {
      method: "POST",
      headers: {
        "Accept-Language": currentLang,
      },
      body: worksapceAndSurvey,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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
