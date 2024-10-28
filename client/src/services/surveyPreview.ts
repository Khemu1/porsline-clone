import { translations } from "../components/lang/translations";
import { SurveyPreviewModel } from "../types";
import { CustomError } from "../utils/CustomError";

export const getSurveyForPreview = async (
  surveyPath: string,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
): Promise<SurveyPreviewModel> => {
  try {
    const response = await fetch(`/api/preview-survey/${surveyPath}`, {
      method: "GET",
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
