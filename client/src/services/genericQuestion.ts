import { translations } from "../components/lang/translations";
import { CustomError } from "../utils/CustomError";

export const addQuestion = async (
  question: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/question/add`, {
      method: "POST",
      headers: {
        "Accept-Language": currentLang,
      },
      body: question,
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

export const deleteQuestion = async (
  questionId: number,
  worksapceAndSurvey: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/question/delete/${questionId}`, {
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

export const duplicateQuestion = async (
  questionId: number,
  worksapceAndSurvey: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/question/duplicate/${questionId}`, {
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

export const editQuestion = async (
  questionId: number,
  question: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch(`/api/question/edit/${questionId}`, {
      method: "PUT",
      headers: {
        "Accept-Language": currentLang,
      },
      body: question,
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
