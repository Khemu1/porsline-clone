import { commonTranslations } from "./common";
import { defaultEnding } from "./defaultEndings";
import { GenericTextErrorTranslations } from "./GenericTextError";
import { surveyTranslations } from "./survey";
import { surveyBuilderTranslations } from "./surveyBuilder";
import { groupTranslations } from "./group";
import { workspaceErrorsTranslations } from "./workspace";

export const translations = {
  en: {
    ...surveyTranslations.en,
    ...commonTranslations.en,
    ...surveyBuilderTranslations.en,
    ...GenericTextErrorTranslations.en,
    ...defaultEnding.en,
    ...groupTranslations.en,
    ...workspaceErrorsTranslations.en,
  },
  de: {
    ...surveyTranslations.de,
    ...commonTranslations.de,
    ...surveyBuilderTranslations.de,
    ...GenericTextErrorTranslations.de,
    ...defaultEnding.de,
    ...groupTranslations.de,
    ...workspaceErrorsTranslations.de,
  },
};
