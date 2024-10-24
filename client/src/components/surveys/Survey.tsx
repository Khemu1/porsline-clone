import { SurveyProps } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../lang/LanguageProvider";
import UpdateSurveyTitleDialog from "../Dialog/survey/UpdateSurveyTitleDialog";
import MoveSurveyDialog from "../Dialog/survey/MoveSurveyDialog";
import DuplicateSurveyDialog from "../Dialog/survey/DuplicateSurveyDialog";
import { useChangeSurveyStatus, useDeleteSurvey } from "../../hooks/survey";
import { setCurrentSurvey } from "../../store/slices/currentSurveySlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Survey: React.FC<SurveyProps> = ({ survey, onSelect }) => {
  const { t, getCurrentLanguageTranslations, getCurrentLanguage } =
    useLanguage();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isMoveDialogOpen, setMoveDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const { handleDeleteSurvey } = useDeleteSurvey();
  const surveyCardMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const { handleUpdateSurveyStatus } = useChangeSurveyStatus();

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );

  const toggleSurveyStatus = async () => {
    try {
      dispatch(setCurrentSurvey(survey));
      await handleUpdateSurveyStatus({
        surveyId: survey.id,
        workspaceId: survey.workspace,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
    } catch (error) {
      console.error("Error toggling survey status:", error);
    }
  };

  const handleOpenUpdateTitleDialog = () => {
    setMenuOpen(false);
    setUpdateDialogOpen(true);
  };

  const handleOpenMoveDialog = () => {
    setMenuOpen(false);
    setMoveDialogOpen(true);
  };

  const handleOpenDuplicateDialog = () => {
    setMenuOpen(false);
    setIsDuplicateDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setUpdateDialogOpen(false);
    setMoveDialogOpen(false);
    setIsDuplicateDialogOpen(false);
  };

  const handleDelete = () => {
    handleDeleteSurvey({
      surveyId: survey.id,
      workspaceId: survey.workspace,
      getCurrentLanguageTranslations,
      currentLang: getCurrentLanguage(),
    });
  };
  const toggleMenu = async () => {
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
    <>
      <div className="survey">
        <div className="flex w-full h-full">
          <Link
            to={`/survey/${currentWorkspace?.id}/${survey.id}/build`}
            className="flex item h-full pl-2 border-r cursor-pointer border-r-gray-500 w-[60%]"
          >
            <p className="m-auto text-[#859fd1] font-semibold text-ellipsis overflow-hidden px-2 text-nowrap whitespace-nowrap">
              {survey.title}
            </p>
          </Link>
          <div className="flex flex-col justify-end h-full w-[40%] bg-[#1b1b1b] p-2 gap-1">
            <div className="flex flex-col h-full w-full relative">
              <button className="survey_card_buttons">{t("preview")}</button>
              <button
                onClick={toggleSurveyStatus}
                className={`survey_card_buttons ${
                  survey.isActive ? "text-red-600" : "text-green-600"
                }`}
              >
                {survey.isActive ? t("deactivate") : t("activate")}
              </button>
              <div
                className={`status flex absolute inset-0 bg-[#1b1b1b] transition-opacity duration-250`}
              >
                <button
                  className={`font-semibold ${
                    survey.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {survey.isActive ? t("active") : t("inactive")}
                </button>
              </div>
            </div>

            <button
              ref={toggleButtonRef}
              className="border opacity-100 border-gray-500 w-max h-max rounded-md"
              onClick={async () => {
                await toggleMenu();
                onSelect(survey);
              }}
            >
              <img
                src="/assets/icons/dots.svg"
                alt="options"
                className="w-[27px] h-[27px]"
              />
            </button>

            {menuOpen && (
              <div
                ref={surveyCardMenuRef}
                className="flex flex-col text-left right-0 text-sm absolute top-0 bg-[#0e0e0e] p-2 rounded-md shadow-md z-10"
              >
                <span
                  className="survey_card_buttons"
                  onClick={handleOpenUpdateTitleDialog}
                >
                  {t("rename")}
                </span>
                <span
                  className="survey_card_buttons"
                  onClick={handleOpenMoveDialog}
                >
                  {t("move")}
                </span>
                <span
                  className="survey_card_buttons"
                  onClick={handleOpenDuplicateDialog}
                >
                  {t("duplicate")}
                </span>
                <span
                  className="survey_card_buttons text-red-600"
                  onClick={handleDelete}
                >
                  {t("delete")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isUpdateDialogOpen && (
        <UpdateSurveyTitleDialog
          isOpen={isUpdateDialogOpen}
          onClose={handleCloseDialogs}
        />
      )}
      {isMoveDialogOpen && (
        <MoveSurveyDialog
          isOpen={isMoveDialogOpen}
          onClose={handleCloseDialogs}
        />
      )}
      {isDuplicateDialogOpen && (
        <DuplicateSurveyDialog
          isOpen={isDuplicateDialogOpen}
          onClose={handleCloseDialogs}
        />
      )}
    </>
  );
};

export default Survey;
