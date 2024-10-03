import { SurveyProps } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../lang/LanguageProvider";

const Survey: React.FC<SurveyProps> = ({ survey, onSelect }) => {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const surveyCardMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        surveyCardMenuRef.current &&
        !surveyCardMenuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`survey`} onClick={() => onSelect(survey)}>
      <div className="flex  h-full">
        <div className="flex item h-full  pl-2 border-r border-r-gray-500 w-[60%]">
          <p className="flex items-center text-[#859fd1] font-semibold ">
            {survey.title}
          </p>
        </div>
        <div className="flex flex-col justify-end h-full w-[40%] bg-[#1b1b1b] p-2 gap-1">
          <div className="flex flex-col h-full w-full relative">
            <button className="survey_card_buttons">{t("renameSurvey")}</button>
            <button
              className={`survey_card_buttons ${
                survey.isActive ? "text-red-600" : "text-green-600"
              }`}
            >
              {survey.isActive ? t("deactivateSurvey") : t("activateSurvey")}
            </button>
            <div
              className={`status flex absolute inset-0 bg-[#1b1b1b] transition-opacity duration-250 `}
            >
              <button
                className={`font-semibold  ${
                  survey.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {survey.isActive ? t("activeSurvey") : t("inactiveSurvey")}
              </button>
            </div>
          </div>

          <button
            className="border opacity-100 border-gray-500 w-max h-max rounded-md "
            onClick={toggleMenu}
            ref={toggleButtonRef}
          >
            <img
              src="/assets/icons/dots.svg"
              alt="options"
              className="w-[27px] h-[27px]"
            />
            {menuOpen && (
              <div
                className="flex flex-col text-left right-0 text-sm absolute  top-0 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
                ref={surveyCardMenuRef}
              >
                <span className="survey_card_buttons">{t("renameSurvey")}</span>
                <span className="survey_card_buttons">{t("moveSurvey")}</span>
                <span className="survey_card_buttons">
                  {t("duplicateSurvey")}
                </span>
                <span className="survey_card_buttons text-red-600">
                  {t("deleteSurvey")}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
