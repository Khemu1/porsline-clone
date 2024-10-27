import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { translations } from "./translations";

type Translations = typeof translations;

export type TranslationKeys = keyof Translations["en"];

type LanguageContextType = {
  language: keyof Translations;
  setLanguage: (lang: keyof Translations) => void;
  t: (key: TranslationKeys) => string;
  getCurrentLanguageTranslations: () => Translations["en"];
  getCurrentLanguage: () => keyof Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<keyof Translations>(() => {
    return (localStorage.getItem("language") as keyof Translations) || "en";
  });

  const t = (key: TranslationKeys) => {
    return translations[language][key] || key;
  };

  const getCurrentLanguageTranslations = () => {
    return translations[language];
  };

  const getCurrentLanguage = () => {
    return language;
  };

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getCurrentLanguageTranslations,
        getCurrentLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
