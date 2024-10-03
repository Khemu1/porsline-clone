import { useState, ChangeEvent, FormEvent } from "react";
import authPortalStyle from "../../styles/authPortal.module.css";
import { useTranslation } from "react-i18next";
import i18n from "../../locals/i18n";
import { useSignIn } from "../../hooks/auth";

// Define the type for the form data
interface FormData {
  username: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { t } = useTranslation("login");

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const { loading, error, success, handleSignIn } = useSignIn();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { username, password } = formData;

      if (username && password) {
        await handleSignIn(formData, t);
      } else {
        window.alert(t("pleaseFillFields"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={authPortalStyle.authPortal}>
      <div className="flex gap-2 mb-5">
        <button onClick={() => changeLanguage("en")} className="btn-secondary">
          English
        </button>
        <button onClick={() => changeLanguage("de")} className="btn-secondary">
          Deutsch
        </button>
      </div>

      <h1 className="mb-5 font-semibold text-5xl italic">{t("loginTitle")}</h1>

      <form onSubmit={handleSubmit}>
        <div className={authPortalStyle.inputContainer}>
          <label htmlFor="username">{t("usernamePlaceholder")}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={t("usernamePlaceholder")}
          />
        </div>

        <div className={authPortalStyle.inputContainer}>
          <label htmlFor="password">{t("passwordPlaceholder")}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("passwordPlaceholder")}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || success}
            className="btn-secondary"
          >
            {t("loginButton")}
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
