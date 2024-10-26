import { useQuery } from "@tanstack/react-query";
import { getSurveyForPreview } from "../services/surveyPreview";
import { SurveyPreviewModel } from "../types";
import { CustomError } from "../utils/CustomError";
import { useState } from "react";
import { translations } from "../components/lang/translations";

export const useGetForPreviewSurvey = (
  surveyId: number,
  getCurrentLanguageTranslations: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const {
    data: survey,
    isError,
    isLoading,
  } = useQuery<SurveyPreviewModel, CustomError>({
    queryKey: ["getForPreviewSurvey", surveyId],
    queryFn: async () => {
      try {
        const survey = await getSurveyForPreview(
          surveyId,
          getCurrentLanguageTranslations,
          currentLang
        );
        return survey;
      } catch (error) {
        const message =
          error instanceof CustomError
            ? error.errors || { message: error.message }
            : { message: "Unknown Error" };
        setErrorState(message);
        throw error;
      }
    },
  });

  return { survey, isError, isLoading, errorState };
};
