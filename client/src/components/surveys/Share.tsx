import { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSurvey } from "../../store/slices/currentSurveySlice";
import { updateWelcomePart } from "../../store/slices/welcomePartSlice";
import { setGenericTexts } from "../../store/slices/questionsSlice";
import {
  setCustomEndings,
  setDefaultEndings,
} from "../../store/slices/endingsSlice";
import { SurveyModel } from "../../types";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../lang/LanguageProvider";
import EditUrlDialog from "../Dialog/survey/EditUrl";
import { updateSurveyF } from "../../utils";
import { useSocket } from "../socket/userSocket";

const Share = () => {
  const [text, setText] = useState("");
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.currentWorkspace.currentWorkspace
  );
  const [editDialog, setEditDialog] = useState(false);
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    const storedSurvey = localStorage.getItem("currentSurvey") ?? "";
    console.log("change");
    const parsedSurvey = JSON.parse(storedSurvey) as SurveyModel;
    if (!currentSurvey && parsedSurvey) {
      dispatch(setCurrentSurvey(parsedSurvey));

      if (parsedSurvey.welcomePart) {
        dispatch(updateWelcomePart(parsedSurvey.welcomePart));
      }
      if (parsedSurvey.questions) {
        dispatch(setGenericTexts(parsedSurvey.questions ?? []));
      }
      if (parsedSurvey.defaultEndings) {
        dispatch(setDefaultEndings(parsedSurvey.defaultEndings ?? []));
      }
      if (parsedSurvey.customEndings) {
        dispatch(setCustomEndings(parsedSurvey.customEndings ?? []));
      }
    } else if (!currentSurvey && !parsedSurvey) {
      console.warn("Survey is null or undefined");
      navigateTo("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSurvey]);

  useEffect(() => {
    console.log("change", currentSurvey?.url);
    if (currentSurvey?.url) {
      const url = `http://localhost:5173/survey/${currentSurvey.url}`;
      setText(url);
    }
  }, [currentSurvey]);

  const socket = useSocket();
  useEffect(() => {
    const handleEditSurvey = async (data: {
      survey: SurveyModel;
      surveyWorkspaceId: number;
    }) => {
      console.log("incoming ins socket", data);
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
    <>
      <div className="flex items-center mt-10 justify-center gap-3 main_text p-3 ">
        <div className="flex flex-col gap-4 bg-[#181a1b] p-4 rounded-md">
          <span className="main_text_bold text-xl mx-auto">
            {t("surveyLink")}
          </span>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              disabled={true}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-[400px]"
            />
          </div>
          <div className="flex justify-between">
            <button
              className="bg-[#2f2b72] px-4 py-2 rounded-md text-sm font-semibold transition-all hover:bg-[#3d37a9]"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              {t("copy")}
            </button>{" "}
            <button
              className="input_border px-4 py-2 rounded-md text-sm font-semibold"
              onClick={() => setEditDialog(true)}
            >
              {t("customizeLink")}
            </button>{" "}
          </div>
        </div>
      </div>
      {editDialog && (
        <EditUrlDialog
          isOpen={editDialog}
          onClose={() => setEditDialog(false)}
        />
      )}
    </>
  );
};

export default Share;
