
export const mapSurveyErrorsTranslations = (translations: string) => {
  return Object.entries(translations).map(([lang, errors]) => {
    return {
      language: lang,
      translations: Object.entries(errors).map(([key, value]) => ({
        key,
        value,
      })),
    };
  });
};

// Function to Map Workspace Translations
export const mapWorkspaceTranslations = (translations: string) => {
  return Object.entries(translations).map(([lang, workspace]) => {
    return {
      language: lang,
      translations: Object.entries(workspace).map(([key, value]) => ({
        key,
        value,
      })),
    };
  });
};
