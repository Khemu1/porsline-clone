import { commonTranslations } from "../../locals/commonTranslations";
import { defaultEnding } from "../../locals/defaultEnding";
import { GenericTextTranslations } from "../../locals/GenericText";
import { GenericTextErrorTranslations } from "../../locals/GenericTextError";
import { surveyTranslations } from "../../locals/survey";
import { surveyBuilderTranslations } from "../../locals/surveyBuilder";
import { surveyErrorsTranslations } from "../../locals/surveyErrors";
import { workspaceTranslations } from "../../locals/workspace";
import { workspaceErrorsTranslations } from "../../locals/worskspaceErrors";
import { login } from "../../locals/login";

export const translations = {
  en: {
    ...surveyTranslations.en,
    ...surveyErrorsTranslations.en,
    ...workspaceTranslations.en,
    ...commonTranslations.en,
    ...surveyBuilderTranslations.en,
    ...GenericTextErrorTranslations.en,
    ...GenericTextTranslations.en,
    ...defaultEnding.en,
    ...workspaceErrorsTranslations.en,
    ...login.en,
  },
  de: {
    ...surveyTranslations.de,
    ...surveyErrorsTranslations.de,
    ...workspaceTranslations.de,
    ...commonTranslations.de,
    ...surveyBuilderTranslations.de,
    ...GenericTextErrorTranslations.de,
    ...GenericTextTranslations.de,
    ...defaultEnding.de,
    ...workspaceErrorsTranslations.de,
    ...login.de,
  },
};
