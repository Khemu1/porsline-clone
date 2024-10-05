import { commonTranslations } from "../../locals/commonTranslations";
import { surveyTranslations } from "../../locals/survey";
import { surveyErrorsTranslations } from "../../locals/surveyErrors";
import { workspaceTranslations } from "../../locals/workspace";

export const translations = {
  en: {
    ...surveyTranslations.en,
    ...surveyErrorsTranslations.en,
    ...workspaceTranslations.en,
    ...commonTranslations.en,
  },
  de: {
    ...surveyTranslations.de,
    ...surveyErrorsTranslations.de,
    ...workspaceTranslations.de,
    ...commonTranslations.de,
  },
};
