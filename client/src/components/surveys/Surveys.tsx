import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSurvey } from "../../store/slices/currentSurveySlice";
import { RootState } from "../../store/store";
import { SurveyModel } from "../../types";
import Survey from "./Survey";
import CreateSurveyDialog from "../Dialog/survey/CreateSurveyDialog";
import { useLanguage } from "../lang/LanguageProvider";
import { useSocket } from "../socket/userSocket";
import {
  addSurveyF,
  deleteSurveyF,
  duplicateSurveyF,
  moveSurveyF,
  updateSurveyF,
} from "../../utils";

const Surveys = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const { surveys, currentWorkspace, currentSurvey } = useSelector(
    (state: RootState) => ({
      currentWorkspace: state.currentWorkspace.currentWorkspace,
      surveys: state.survey.surveys,
      currentSurvey: state.currentSurvey.currentSurvey,
    })
  );
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyModel | null>(
    null
  );
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);

  const handleSurveySelect = (survey: SurveyModel) => {
    try {
      setSelectedSurvey(survey);
      dispatch(setCurrentSurvey(survey));
    } catch (error) {
      console.error(error);
    }
  };

  const socket = useSocket();
  useEffect(() => {
    if (!currentWorkspace?.id || !currentSurvey?.id) return;
    
    const handleSurvey = async (data: { survey: SurveyModel }) => {
      console.log("just arrived", data);
      try {
        await addSurveyF(+currentWorkspace!.id, data.survey, dispatch);
      } catch (error) {
        console.error(error);
      }
    };

    const handleEditSurvey = async (data: {
      survey: SurveyModel;
      surveyWorkspaceId: number;
    }) => {
      try {
        await updateSurveyF(
          data.survey,
          currentSurvey.id,
          data.surveyWorkspaceId,
          currentWorkspace.id,
          dispatch
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handleMoveSurvey = async (data: {
      surveyId: string | number;
      sourceWorkspaceId: string | number;
      targetWorkspaceId: string | number;
      survey: SurveyModel;
    }) => {
      try {
        await moveSurveyF(
          +data.surveyId,
          +data.sourceWorkspaceId,
          +data.targetWorkspaceId,
          +currentWorkspace.id,
          data.survey,
          dispatch
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handleDeleteSurvey = async (data: {
      surveyId: string | number;
      surveyWorkspaceId: string | number;
    }) => {
      try {
        await deleteSurveyF(
          +data.surveyId,
          +currentWorkspace.id,
          +data.surveyWorkspaceId,
          dispatch
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handleSurveyDuplicated = async (data: { survey: SurveyModel }) => {
      try {
        if (currentWorkspace?.id) {
          await duplicateSurveyF(data.survey, +currentWorkspace.id, dispatch);
        } else {
          console.error("Current workspace ID not found.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("SURVEY_ADDED", handleSurvey);
    socket.on("SURVEY_EDITED", handleEditSurvey);
    socket.on("SURVEY_DELETED", handleDeleteSurvey);
    socket.on("SURVEY_MOVED", handleMoveSurvey);
    socket.on("SURVEY_DUPLICATED", handleSurveyDuplicated);

    // Cleanup listeners on unmount
    return () => {
      socket.off("SURVEY_ADDED", handleSurvey);
      socket.off("SURVEY_EDITED", handleEditSurvey);
      socket.off("SURVEY_DELETED", handleDeleteSurvey);
      socket.off("SURVEY_MOVED", handleMoveSurvey);
      socket.off("SURVEY_DUPLICATED", handleSurveyDuplicated);
    };
  }, [socket, currentWorkspace, currentSurvey, dispatch]);

  return (
    <>
      <div className="flex w-full flex-wrap gap-5 overflow-scroll">
        <div className="flex items-center justify-center gap-5 w-[292px] h-[212px] bg-[#1d2022] rounded-lg">
          <button
            className="w-max h-max p-1 bg-[#859fd1] rounded-md"
            onClick={() => setIsCreateSurveyOpen(true)}
          >
            <img
              src="/assets/icons/plus.svg"
              alt="plus"
              className="w-[20px] h-[20px]"
            />
          </button>
          <p className="text-[#859fd1] font-semibold">{t("createSurvey")}</p>
        </div>

        {surveys.map((survey) => (
          <Survey
            key={
              survey.id * Date.now() * Math.ceil(Math.random()) * Math.random()
            }
            selected={selectedSurvey?.id === survey.id}
            survey={survey}
            onSelect={handleSurveySelect}
          />
        ))}
      </div>

      <CreateSurveyDialog
        isOpen={isCreateSurveyOpen}
        onClose={() => setIsCreateSurveyOpen(false)}
      />
    </>
  );
};

export default Surveys;
