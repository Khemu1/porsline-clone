import { useDispatch } from "react-redux";
import { useGetUserData } from "../../hooks/userData";
import { useLanguage } from "../lang/LanguageProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setGroup } from "../../store/slices/userGroup";
import UserGroup from "./UserGroup";

const Profile = () => {
  const dispatch = useDispatch();
  const { t, getCurrentLanguage, setLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const navigateTo = useNavigate();
  const { isLoading, user } = useGetUserData(
    getCurrentLanguageTranslations,
    getCurrentLanguage()
  );

  useEffect(() => {
    if (!user && !isLoading) {
      navigateTo("/authportal");
    }
    if (user) {
      dispatch(setGroup(user.userData.createdGroup));
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col p-6 gap-8 bg-[#121212] min-h-screen text-[#e4e4e4]">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-3xl font-bold mb-2">{t("switchLanguage")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.setItem("language", "en");
              setLanguage("en");
            }}
            className={`px-4 py-2 rounded-md transition-all text-white font-semibold ${
              getCurrentLanguage() === "en"
                ? "bg-blue-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {t("english")}
          </button>
          <button
            onClick={() => {
              localStorage.setItem("language", "de");
              setLanguage("de");
            }}
            className={`px-4 py-2 rounded-md transition-all text-white font-semibold ${
              getCurrentLanguage() === "de"
                ? "bg-blue-600"
                : "bg-gray-600 hover:bg-gray-500"
            }`}
          >
            {t("german")}
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        <UserGroup />
      </div>
    </div>
  );
};

export default Profile;
