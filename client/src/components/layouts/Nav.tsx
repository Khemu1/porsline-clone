import { Link, useLocation, useParams } from "react-router-dom";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "../lang/LanguageProvider";
import { useChangeSurveyStatus } from "../../hooks/survey";
import { SurveyModel } from "../../types";
import { updateSurveyF } from "../../utils";
import { useEffect } from "react";
import { useSocket } from "../socket/userSocket";

const Nav = () => {
  const { t, getCurrentLanguage, getCurrentLanguageTranslations } =
    useLanguage();
  const { surveyId, workspaceId } = useParams();
  const location = useLocation();
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );

  const isSurveyBuilderPath = /^\/survey\/[0-9]+\/[0-9]+\/build(\/.*)?$/.test(
    location.pathname
  );
  const isSharePath = /^\/survey\/[0-9]+\/[0-9]+\/share(\/.*)?$/.test(
    location.pathname
  );
  const isProfilePath = location.pathname === "/profile";

  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const { handleUpdateSurveyStatus } = useChangeSurveyStatus();

  const toggleSurveyStatus = async () => {
    try {
      await handleUpdateSurveyStatus({
        surveyId: currentSurvey!.id,
        workspaceId: currentSurvey!.workspace,
        getCurrentLanguageTranslations,
        currentLang: getCurrentLanguage(),
      });
    } catch (error) {
      console.error("Error toggling survey status:", error);
    }
  };

  const socket = useSocket();
  const dispatch = useDispatch();
  useEffect(() => {
    const handleEditSurvey = async (data: {
      survey: SurveyModel;
      surveyWorkspaceId: number;
    }) => {
      try {
        await updateSurveyF(
          data.survey,
          currentSurvey!.id,
          data.surveyWorkspaceId,
          currentWorkspace!.id,
          dispatch
        );
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("SURVEY_EDITED", handleEditSurvey);

    return () => {
      socket.off("SURVEY_EDITED", handleEditSurvey);
    };
  }, [socket, currentWorkspace, currentSurvey, dispatch]);
  return (
    <nav
      className={`${
        isSurveyBuilderPath || isProfilePath || isSharePath
          ? "justify-between"
          : "justify-end"
      }`}
    >
      {isProfilePath && (
        <Link
          to={`/`}
          className="flex items-center justify-center rounded-md main_text text-sm transition-all gap-1"
        >
          <img
            src="/assets/icons/back-arrow.svg"
            alt="Profile"
            className="w-[25px] rotate-180 transition-all rounded-md hover:bg-[#4d4c4c6f]"
          />
          <span>Surveys</span>
        </Link>
      )}

      {(isSurveyBuilderPath || isSharePath) && (
        <div className="flex flex-grow">
          <Link to={`/`} className="flex items-center ">
            <img
              src="/assets/icons/back-arrow.svg"
              alt="Profile"
              className="w-[25px] rotate-180 transition-all rounded-md hover:bg-[#4d4c4c6f]"
            />
            <span className="text pb-1">
              {currentWorkspace?.title ?? t("goBack")}
            </span>
          </Link>
          <div className="flex justify-center flex-grow ">
            <Link to={`survey/${workspaceId}/${surveyId}/build`}>
              {t("create")}
              <span className="mx-2 text-sm">{">"}</span>
            </Link>
            <Link to={`survey/${workspaceId}/${surveyId}/share`}>
              {t("share")}
            </Link>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {isSurveyBuilderPath && (
          <div className="flex items-center gap-2 border-r px-2 border-r-[#f6f6f627]">
            <Link to={`/survey/${currentSurvey?.url}`} target="_blank">
              <img
                src="/assets/icons/preview-eye.svg"
                alt="Preview"
                className="transition-all hover:bg-[#6272a4] rounded-md cursor-pointer"
              />
            </Link>
            {currentSurvey && (
              <div className="transition-all  pb-1 hover:bg-[#303031d6] px-2 rounded-md">
                <button
                  onClick={toggleSurveyStatus}
                  className={`border-b-2 ${
                    currentSurvey.isActive
                      ? "border-green-600"
                      : "border-red-600"
                  }`}
                >
                  {currentSurvey.isActive ? t("active") : t("inactive")}
                </button>
              </div>
            )}
          </div>
        )}
        <Link
          to={"/profile"}
          className="p-[1px] cursor-pointer transition-all hover:bg-[#6272a4] rounded-md"
        >
          <img
            src="/assets/icons/profile.svg"
            alt="Profile"
            className="w-[20px]"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
