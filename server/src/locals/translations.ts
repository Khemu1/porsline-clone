import { commonTranslations } from "./common";
import { surveyTranslations } from "./survey";
import { surveyBuilderTranslations } from "./surveyBuilder";

export const translations = {
  en: {
    ...surveyTranslations.en,
    ...commonTranslations.en,
    ...surveyBuilderTranslations.en,
  },
  de: {
    ...surveyTranslations.de,
    ...commonTranslations.de,
    ...surveyBuilderTranslations.de,
  },
};
