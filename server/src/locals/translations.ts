import { commonTranslations } from "./common";
import { surveyTranslations } from "./survey";

export const translations = {
  en: {
    ...surveyTranslations.en,
    ...commonTranslations.en,
  },
  de: {
    ...surveyTranslations.de,
    ...commonTranslations.de,
  },
};
