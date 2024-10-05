import { SurveyProps } from "../../types";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../lang/LanguageProvider";
import UpdateSurveyTitleDialog from "../Dialog/UpdateSurveyTitleDialog";
import MoveSurveyDialog from "../Dialog/MoveSurveyDialog";
import DuplicateSurveyDialog from "../Dialog/DuplicateSurveyDialog";

const Survey: React.FC<SurveyProps> = ({ survey, onSelect }) => {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [isMoveDialogOpen, setMoveDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

  const surveyCardMenuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenUpdateTitleDialog = () => {
    setMenuOpen(false);
    console.log("Opening update dialog");
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateTitleDialog = () => {
    console.log("Closing update dialog");
    setUpdateDialogOpen(false);
  };

  const handleOpenMoveDialog = () => {
    setMenuOpen(false);
    console.log("Opening move dialog");
    setMoveDialogOpen(true);
  };

  const handleCloseMoveDialog = () => {
    console.log("Closing move dialog");
    setMoveDialogOpen(false);
  };

  const handleOpenDuplicateDialog = () => {
    setMenuOpen(true);
    console.log("Opening update dialog");
    setIsDuplicateDialogOpen(true);
  };
  const handleCloseDuplicateDialog = () => {
    console.log("Closing move dialog");
    setIsDuplicateDialogOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        surveyCardMenuRef.current &&
        !surveyCardMenuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        console.log("Clicked outside, closing menu");
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
      <div className="survey" onClick={() => onSelect(survey)}>
        <div className="flex w-full h-full">
          <div className="flex item h-full pl-2 border-r border-r-gray-500 w-[60%]">
            <p className="m-auto text-[#859fd1] font-semibold text-ellipsis overflow-hidden px-2 text-nowrap whitespace-nowrap">
              {survey.title}
            </p>
          </div>
          <div className="flex flex-col justify-end h-full w-[40%] bg-[#1b1b1b] p-2 gap-1">
            <div className="flex flex-col h-full w-full relative">
              <button className="survey_card_buttons">{t("preview")}</button>
              <button
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
              onClick={() => setMenuOpen((prev) => !prev)}
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
                <span className="survey_card_buttons text-red-600">
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
          onClose={handleCloseUpdateTitleDialog}
        />
      )}

      {isMoveDialogOpen && (
        <MoveSurveyDialog
          isOpen={isMoveDialogOpen}
          onClose={handleCloseMoveDialog}
        />
      )}
      {isDuplicateDialogOpen && (
        <DuplicateSurveyDialog
          isOpen={isDuplicateDialogOpen}
          onClose={handleCloseDuplicateDialog}
        />
      )}
    </>
  );
};

export default Survey;
