import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import authPortalStyle from "../../styles/authPortal.module.css";
import { useSignIn } from "../../hooks/auth";
import { useLanguage } from "../lang/LanguageProvider";

// Define the type for the form data
interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { t, setLanguage, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  // State to hold the selected language
  const [language, setLanguageState] = useState<string>("en");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { loading, error, success, handleSignIn } = useSignIn(
    getCurrentLanguage(),
    getCurrentLanguageTranslations
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { username, password } = formData;

      if (username && password) {
        await handleSignIn(formData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    setLanguageState(selectedLanguage);
    setLanguage(selectedLanguage as "en" | "de");
    localStorage.setItem("language", selectedLanguage);
  };

  useEffect(() => {
    const language = localStorage.getItem("language");
    if (language) {
      setLanguageState(language);
    }
  }, []);

  return (
    <div className={authPortalStyle.authPortal}>
      <div className={`flex w-full mb-5`}>
        <select
          className="p-1"
          id="language"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="en">{t("english")}</option>
          <option value="de">{t("german")}</option>
        </select>
      </div>
      <h1 className="mb-5 font-semibold text-5xl italic">{t("login")}</h1>

      <form onSubmit={handleSubmit}>
        <div className={authPortalStyle.inputContainer}>
          <label htmlFor="username">{t("username")}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={t("enterUsername")}
          />
        </div>

        <div className={authPortalStyle.inputContainer}>
          <label htmlFor="password">{t("password")}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("enterPassword")}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || success}
            className="btn-secondary"
          >
            {t("login")}
          </button>
        </div>
        {error && (
          <p className="text-red-500 mx-auto text-center">{error.message}</p>
        )}
      </form>
    </div>
  );
};

export default SignIn;
