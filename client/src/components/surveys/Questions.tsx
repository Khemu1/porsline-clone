import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../lang/LanguageProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useDeleteQuestion,
  useDuplicateQuestion,
} from "../../hooks/genericQuestion";
import {
  addNewQuestionF,
  editQuestionF,
  removeQuestionF,
  transformDataIntoFormData,
} from "../../utils";
import EditGenericTextQuestion from "../Dialog/survey/edit/question/EditGenericTextQuestion";
import { GenericTextModel } from "../../types";
import { findGenericTextIndex } from "../../store/slices/questionsSlice";
import { useSocket } from "../socket/userSocket";

const Questions: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { workspaceId, surveyId } = useParams();
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();

  const currentQuestions = useSelector(
    (state: RootState) => state.genericTexts
  );
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );

  const { handleDeleteEnding } = useDeleteQuestion();
  const { handleDuplicateQuestion } = useDuplicateQuestion();

  const [menuOpen, setMenuOpen] = useState<Record<number, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] =
    useState<GenericTextModel | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const socket = useSocket();

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

  const toggleMenu = useCallback((id: number) => {
    setMenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleDelete = useCallback(
    (questionId: number) => {
      const formData = new FormData();
      transformDataIntoFormData({ workspaceId, surveyId }, formData);
      handleDeleteEnding({
        questionId,
        workspaceAndSurvey: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
      toggleMenu(questionId);
    },
    [
      workspaceId,
      surveyId,
      handleDeleteEnding,
      getCurrentLanguage,
      getCurrentLanguageTranslations,
      toggleMenu,
    ]
  );
  const handleDuplicate = useCallback(
    (questionId: number) => {

      const formData = new FormData();
      transformDataIntoFormData({ workspaceId, surveyId }, formData);
      handleDuplicateQuestion({
        questionId,
        workspaceAndSurvey: formData,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
      toggleMenu(questionId);
    },
    [
      workspaceId,
      surveyId,
      handleDuplicateQuestion,
      getCurrentLanguage,
      getCurrentLanguageTranslations,
      toggleMenu,
    ]
  );

  const onClose = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete("type");
    searchParams.delete("id");

    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });

    setIsDialogOpen(false);
    setCurrentQuestion(null);
  }, [navigate, location]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (type === "question" && id) {
      const questionToEdit = currentQuestions.find((q) => q.id === Number(id));
      if (questionToEdit) {
        setCurrentQuestion(questionToEdit);
        setIsDialogOpen(true);
      }
    }
  }, [location, currentQuestions]);

  useEffect(() => {
    const handleNewQuestion = async (data: {
      newGenericText: GenericTextModel;
    }) => {
      if (currentSurvey?.id !== +data.newGenericText.surveyId) return;
      await addNewQuestionF(data.newGenericText, dispatch);
    };

    const handleEditedQuestion = async (data: {
      editedGenericText: GenericTextModel;
    }) => {
      if (currentSurvey?.id !== +data.editedGenericText.surveyId) return;
      editQuestionF(data.editedGenericText, dispatch);
    };

    const handleDeletedQuestion = (data: {
      surveyId: string | number;
      questionId: string | number;
    }) => {
      if (currentSurvey?.id !== +data.surveyId) return;
      removeQuestionF(+data.questionId, dispatch);
    };

    const handleDuplicatedQuestion = async (data: {
      duplicatedGenericText: GenericTextModel;
    }) => {
      if (currentSurvey?.id !== +data.duplicatedGenericText.surveyId) return;
      await addNewQuestionF(data.duplicatedGenericText, dispatch);
    };

    socket.on("GENERIC_TEXT_ADDED", handleNewQuestion);
    socket.on("GENERIC_TEXT_EDITED", handleEditedQuestion);
    socket.on("GENERIC_TEXT_DELETED", handleDeletedQuestion);
    socket.on("GENERIC_TEXT_DUPLICATED", handleDuplicatedQuestion);

    return () => {
      socket.off("GENERIC_TEXT_ADDED", handleNewQuestion);
      socket.off("GENERIC_TEXT_EDITED", handleEditedQuestion);
      socket.off("GENERIC_TEXT_DELETED", handleDeletedQuestion);
      socket.off("GENERIC_TEXT_DUPLICATED", handleDuplicatedQuestion);
    };
  }, [socket, currentSurvey, dispatch]);

  const renderedQuestions = useMemo(
    () =>
      currentQuestions.map((question, index) => (
        <div
          key={question.id}
          onClick={() =>
            navigate(
              `/survey/${workspaceId}/${surveyId}/build/edit?type=question&id=${question.id}`
            )
          }
          className="relative flex w-full items-center transition-all hover:bg-[#303033] hover:text-white rounded-lg py-1 px-3"
        >
          <div className="flex justify-start items-center gap-2 w-full cursor-pointer">
            <div className="flex survey_builder_icon">
              <img
                src="/assets/icons/text.svg"
                alt="question"
                className="w-[30px]"
              />
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
            onClick={(e) => {
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate(question.id);
                }}
              >
                {t("duplicate")}
              </span>
              <span
                className="survey_card_buttons text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(question.id);
                }}
              >
                {t("delete")}
              </span>
            </div>
          )}
        </div>
      )),
    [
      currentQuestions,
      toggleMenu,
      menuOpen,
      workspaceId,
      surveyId,
      navigate,
      t,
      handleDelete,
      handleDuplicate,
    ]
  );

  if (!currentSurvey) {
    return <div>Loading survey...</div>;
  }

  return (
    <>
      {renderedQuestions}{" "}
      {isDialogOpen && currentQuestion && (
        <EditGenericTextQuestion
          isOpen={isDialogOpen}
          onClose={onClose}
          question={currentQuestion}
          index={findGenericTextIndex(currentQuestions, currentQuestion.id)}
        />
      )}
    </>
  );
};

export default Questions;
