import { translations } from "../components/lang/translations";
import { CustomError } from "../utils/CustomError";

export const addWelcomePart = async (
  welcomePart: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/welcomepart/add`, {
      method: "POST",
      headers: {
        "Accept-Language": currentLang,
      },
      body: welcomePart,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

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

export const deleteWelcomePart = async (
  welcomePartId: number,
  worksapceAndSurvey: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/welcomepart/delete/${welcomePartId}`, {
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
        errorData.message ?? currentLanguageTranslations.unknownError;

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

export const duplicateWelcomePart = async (
  welcomePartId: number,
  worksapceAndSurvey: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(
      `/api/welcomepart/duplicate/${welcomePartId}`,
      {
        method: "POST",
        headers: {
          "Accept-Language": currentLang,
        },
        body: worksapceAndSurvey,
      }
    );

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

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

export const editWelcomePart = async (
  welcomePartId: number,
  welcomePart: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/welcomepart/edit/${welcomePartId}`, {
      method: "POST",
      headers: {
        "Accept-Language": currentLang,
      },
      body: welcomePart,
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

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
