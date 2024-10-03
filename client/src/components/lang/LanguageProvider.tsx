import { createContext, useState, useContext, ReactNode } from "react";

// Define the structure of the translations
type Translations = {
  en: {
    workSpaceTitle: string;
    deleteWorkspace: string;
    renameWorkspace: string;
    deleteSurvey: string;
    renameSurvey: string;
    moveSurvey: string;
    previewSurvey: string;
    activeSurvey: string;
    inactiveSurvey: string;
    activateSurvey: string;
    deactivateSurvey: string;
    duplicateSurvey: string;
  };
  de: {
    workSpaceTitle: string;

    deleteWorkspace: string;
    renameWorkspace: string;
    deleteSurvey: string;
    renameSurvey: string;
    moveSurvey: string;
    previewSurvey: string;
    activeSurvey: string;
    inactiveSurvey: string;
    activateSurvey: string;
    deactivateSurvey: string;
    duplicateSurvey: string;
  };
};

type TranslationKeys = keyof Translations["en"];

type LanguageContextType = {
  language: keyof Translations;
  setLanguage: (lang: keyof Translations) => void;
  t: (key: TranslationKeys) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations: Translations = {
  en: {
    workSpaceTitle: "workspaces",
    deleteWorkspace: "Delete Workspace",
    renameWorkspace: "Rename",
    deleteSurvey: "Delete",
    renameSurvey: "Rename",
    moveSurvey: "Move Survey to another workspace",
    previewSurvey: "Preview",
    activeSurvey: "Active",
    inactiveSurvey: "Inactive",
    activateSurvey: "Activate",
    deactivateSurvey: "Deactivate",
    duplicateSurvey: "Survey",
  },
  de: {
    workSpaceTitle: "Arbeitsbereiche",
    deleteWorkspace: "Arbeitsbereich löschen",
    renameWorkspace: "Umbenennen",
    deleteSurvey: "Löschen",
    renameSurvey: "Umbenennen",
    moveSurvey: "Umfrage in ein anderes Arbeitsbereich verschieben",
    previewSurvey: "Vorschau",
    activeSurvey: "Aktiv",
    inactiveSurvey: "Inaktiv",
    activateSurvey: "Aktivieren",
    deactivateSurvey: "Deaktivieren",
    duplicateSurvey: "Duplizieren",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<keyof Translations>("en");

  const t = (key: TranslationKeys) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
