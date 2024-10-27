import { useGetUserData } from "../../hooks/userData";
import { useLanguage } from "../lang/LanguageProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { t, getCurrentLanguage, setLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const navigateTo = useNavigate();
  const { isLoading, user } = useGetUserData(
    getCurrentLanguageTranslations,
    getCurrentLanguage()
  );

  console.log(user);
  useEffect(() => {
    if (!user && !isLoading) {
      navigateTo("/authportal");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col p-3 gap-5">
      <div className="flex flex-col gap-4">
        <h2 className="main_text_bold text-2xl">{t("switchLanguage")}</h2>
        <div className="flex gap-2 main_text font-semibold">
          <button
            onClick={() => {
              localStorage.setItem("language", "en");
              setLanguage("en");
            }}
            className={`transition-all text-white rounded-lg p-2 ${
              getCurrentLanguage() === "en"
                ? "bg-blue-600"
                : "bg-slate-400 hover:bg-slate-600"
            }`}
          >
            {t("english")}
          </button>
          <button
            onClick={() => {
              localStorage.setItem("language", "de");
              setLanguage("de");
            }}
            className={`transition-all text-white rounded-lg p-2 ${
              getCurrentLanguage() === "de"
                ? "bg-blue-600"
                : "bg-slate-400 hover:bg-slate-600"
            }`}
          >
            {t("german")}
          </button>
        </div>
      </div>
      <div className="main_text">
        <h2 className="main_text_bold">Your Group</h2>
      </div>
    </div>
  );
};

export default Profile;
