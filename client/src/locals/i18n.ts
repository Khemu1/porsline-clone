import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLogin from "./en/login.json";
import deLogin from "./de/login.json";

const resources = {
  en: {
    login: enLogin, // Login namespace
  },
  de: {
    login: deLogin, // Login namespace
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en", // Fallback to English if translation not available
  ns: ["login"], // Add the "login" namespace
  defaultNS: "login", // Set the default namespace to "login"
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default i18n;
