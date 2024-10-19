import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../lang/LanguageProvider";
import { useParams } from "react-router-dom";
import {
  useDeleteQuestion,
  useDuplicateQuestion,
} from "../../hooks/genericQuestion";
import { transformDataIntoFormData } from "../../utils";

const Questions: React.FC<{
  setOpenTextPage: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpenTextPage }) => {
  const currentQuestions = useSelector(
    (state: RootState) => state.genericTexts
  );
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();

  const { workspaceId, surveyId } = useParams();
  const { handleDeleteEnding } = useDeleteQuestion();
  const { handleDuplicateQuestion } = useDuplicateQuestion();

  const [menuOpen, setMenuOpen] = useState<Record<number, boolean>>({});

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target as Node)
    ) {
      setMenuOpen({});
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleMenu = (id: number) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = (questionId: number) => {
    try {
      const formData = new FormData();
      transformDataIntoFormData({ workspaceId, surveyId }, formData);
      handleDeleteEnding({
        questionId,
        workspaceAndSurvey: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
      toggleMenu(questionId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuplicate = (questionId: number) => {
    try {
      const formData = new FormData();
      transformDataIntoFormData({ workspaceId, surveyId }, formData);
      handleDuplicateQuestion({
        questionId,
        workspaceAndSurvey: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
      toggleMenu(questionId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full justify-between items-center">
      {currentQuestions?.map((question, index) => (
        <div
          key={question.id + Date.now() * Math.round(Math.random() * 100)}
          className="relative flex w-full items-center transition-all hover:bg-[#303033] hover:text-white rounded-lg py-1 px-3"
          onClick={() => setOpenTextPage(true)}
        >
          <div className="flex justify-start items-center gap-2 w-full cursor-pointer">
            <div className="flex survey_builder_icon">
              <div className="">
                <img
                  src="/assets/icons/text.svg"
                  alt="question"
                  className="w-[30px]"
                />
              </div>
              {!question?.hideQuestionNumber && <span>{index + 1}</span>}
            </div>
            <p
              className="text-white font-semibold"
              dangerouslySetInnerHTML={{
                __html: question?.label ?? "",
              }}
            />
          </div>
          <button
            className="flex justify-center items-center border w-[50px] h-[30px] border-[#85808025] rounded-lg"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              toggleMenu(question.id);
            }}
            ref={toggleButtonRef}
          >
            <img
              src="/assets/icons/dots.svg"
              alt="menu"
              className="w-[50px] h-[30px]"
            />
          </button>
          {menuOpen[question.id] && (
            <div
              ref={menuRef}
              className="flex flex-col text-left right-0 text-sm absolute top-10 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
            >
              <span
                className="survey_card_buttons"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleDuplicate(question.id);
                }}
              >
                {t("duplicate")}
              </span>
              <span
                className="survey_card_buttons text-red-600"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleDelete(question.id);
                }}
              >
                {t("delete")}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Questions;
