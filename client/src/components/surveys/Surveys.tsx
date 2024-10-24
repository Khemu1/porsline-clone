import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSurvey } from "../../store/slices/currentSurveySlice";
import { RootState } from "../../store/store";
import { SurveyModel } from "../../types";
import Survey from "./Survey";
import CreateSurveyDialog from "../Dialog/survey/CreateSurveyDialog";
import { useLanguage } from "../lang/LanguageProvider";
import { useSocket } from "../socket/userSocket";
import { updateWorkspace } from "../../store/slices/workspaceSlice";

const Surveys = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const surveys = useSelector((state: RootState) => state.survey.surveys);

  const [selectedSurvey, setSelectedSurvey] = useState<SurveyModel | null>(
    null
  );
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);

  const handleSurveySelect = (survey: SurveyModel) => {
    setSelectedSurvey(survey);
    dispatch(setCurrentSurvey(survey));
  };

  const socket = useSocket();
  useEffect(() => {
    const handleNewWorkspace = async (data: { workspace: WorkSpaceModel }) => {
      console.log("arrived to add", data);

      try {
        await addNewWorkspaceF(data.workspace, dispatch);
      } catch (error) {
        console.error(error);
      }
    };

    const handleEditWorkspace = async (data: {
      workspace: WorkSpaceModel;
      workspaceId: number;
    }) => {
      try {
        console.log("incming edit", data);
        await updateWorkspace(
          data.workspace,
          dispatch
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handleDeleteWorkspace = async (data: { workspaceId: number }) => {
      try {
        console.log("arrived to delete", data);
        await deleteWorkspaceF(
          +data.workspaceId,
          +currentWorkspace!.id,
          workspaces,
          dispatch
        );
      } catch (error) {
        console.error(error);
      }
    };

    socket.on("SURVEY_ADDED", handleNewWorkspace);
    socket.on("WORKSPACE_EDITED", handleEditWorkspace);
    socket.on("WORKSPACE_DELETED", handleDeleteWorkspace);

    return () => {
      socket.off("SURVEY_ADDED", handleNewWorkspace);
      socket.off("WORKSPACE_EDITED", handleEditWorkspace);
      socket.off("WORKSPACE_DELETED", handleDeleteWorkspace);
    };
  }, [socket, workspaces, currentWorkspace, dispatch]);

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
              survey.id * Math.random() * Date.now() * Math.ceil(Math.random())
            }
            selected={selectedSurvey?.id === survey.id}
            survey={survey}
            onSelect={handleSurveySelect}
          />
        ))}
      </div>

      {/* Create Survey Dialog */}
      <CreateSurveyDialog
        isOpen={isCreateSurveyOpen}
        onClose={() => setIsCreateSurveyOpen(false)}
      />
    </>
  );
};

export default Surveys;
