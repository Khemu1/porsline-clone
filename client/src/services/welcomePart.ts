import { translations } from "../components/lang/translations";
import { CustomError } from "../utils/CustomError";

export const addWelcomePart = async (
  welcomePart: FormData,
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    console.log(welcomePart);
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
