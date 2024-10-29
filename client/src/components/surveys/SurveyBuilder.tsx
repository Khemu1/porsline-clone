import { useLanguage } from "../lang/LanguageProvider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Welcome from "../question/welcome/weclome";
import GenericTextQuestion from "../question/genericText/GenericTextQuestion";
import Endings from "../question/endings/Endings";
import { useEffect, useState } from "react";
import { useGetSurvey } from "../../hooks/survey";
import { useParams } from "react-router-dom";
import Questions from "./Questions";
import { setCurrentSurvey } from "../../store/slices/currentSurveySlice";
import { setGenericTexts } from "../../store/slices/questionsSlice";
import {
  setCustomEndings,
  setDefaultEndings,
} from "../../store/slices/endingsSlice";
import EndingsContainer from "./EndingsContainer";
import { updateWelcomePart } from "../../store/slices/welcomePartSlice";
import WelcomePart from "./WelcomePart";
import { WorkSpaceModel } from "../../types";
import { setCurrentWorkspace } from "../../store/slices/currentWorkspaceSlice";

const SurveyBuilder = () => {
  const { workspaceId, surveyId } = useParams();
  const { t, getCurrentLanguageTranslations, getCurrentLanguage } =
    useLanguage();
  const dispatch = useDispatch();

  const welcomePartState = useSelector((state: RootState) => state.welcomePart);
  const endingsState = useSelector((state: RootState) => state.endings);
  const [openWelcomePage, setOpenWelcomePage] = useState(false);
  const [openTextPage, setOpenTextPage] = useState(false);
  const [openEndingsPage, setOpenEndingsPage] = useState(false);
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );

  const { survey } = useGetSurvey(
    Number(workspaceId),
    Number(surveyId),
    getCurrentLanguageTranslations,
    getCurrentLanguage()
  );

  // Load survey from local storage on component mount
  useEffect(() => {
    const savedSurvey = localStorage.getItem("currentSurvey");
    if (savedSurvey) {
      const parsedSurvey = JSON.parse(savedSurvey);
      if (!currentSurvey) {
        dispatch(setCurrentSurvey(parsedSurvey));
        console.log("Loaded survey from local storage:", parsedSurvey);
      }
    }
  }, [currentSurvey, dispatch]);

  useEffect(() => {
    if (survey) {
      console.log("Survey fetched:", survey);
      dispatch(setCurrentSurvey(survey));
      localStorage.setItem("currentSurvey", JSON.stringify(survey)); // Save survey to local storage

      if (survey.welcomePart) {
        dispatch(updateWelcomePart(survey.welcomePart));
      }
      if (survey.questions) {
        dispatch(setGenericTexts(survey.questions ?? []));
      }
      if (survey.defaultEndings) {
        dispatch(setDefaultEndings(survey.defaultEndings ?? []));
      }
      if (survey.customEndings) {
        dispatch(setCustomEndings(survey.customEndings ?? []));
      }
      const itsWorkspace = survey.itsWorkspace as WorkSpaceModel;
      if (itsWorkspace) {
        dispatch(setCurrentWorkspace(itsWorkspace));
      }
    } else {
      console.warn("Survey is null or undefined");
    }
  }, [survey]);

  return (
    <div className="survey_builder">
      <aside>
        <div className="flex flex-col items-center gap-5 mb-5 relative w-full">
          <button
            disabled={welcomePartState.id !== null}
            className={`flex justify-start items-center ${
              welcomePartState.id !== null
                ? "bg-[#0e0f0f81] cursor-not-allowed"
                : "bg-[#0e0f0f] cursor-pointer"
            }  py-1 px-3 gap-2 rounded-lg w-full  transition-all `}
            onClick={() => setOpenWelcomePage(true)}
          >
            <div className="survey_builder_icon_welcome_style">
              <img
                src="/assets/icons/welcome.svg"
                alt="welcome"
                className="w-[30px]"
              />
            </div>
            <p>{t("welcomePage")}</p>
          </button>

          <div
            className="flex justify-start items-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl"
            onClick={() => setOpenTextPage(true)}
          >
            <div>
              <img
                src="/assets/icons/text.svg"
                alt="text"
                className="w-[30px]"
              />
            </div>
            <p>{t("genericText")}</p>
          </div>

          {/* Open Endings Page */}
          <div
            className="flex justify-start items-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl"
            onClick={() => setOpenEndingsPage(true)}
          >
            <div>
              <img
                src="/assets/icons/bye.svg"
                alt="ending"
                className="w-[30px]"
              />
            </div>
            <p>{t("endings")}</p>
          </div>
        </div>
      </aside>

      <section className="">
        <div className="flex flex-col gap-28 mb-5 relative w-full">
          <WelcomePart setOpenWelcomePage={setOpenWelcomePage} />
          <div className="flex flex-col gap-5">
            <Questions />
          </div>

          {endingsState.customEndings || endingsState.defaultEndings ? (
            <EndingsContainer setOpenEndingsPage={setOpenEndingsPage} />
          ) : (
            <div className="w-full">
              <div
                className="welcome_page_style"
                onClick={() => setOpenEndingsPage(true)}
              >
                <img
                  src="/assets/icons/plus.svg"
                  alt="plus"
                  className="w-[20px]"
                />
                <p>{t("endings")}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Endings
        isOpen={openEndingsPage}
        onClose={() => {
          setOpenEndingsPage(false);
        }}
      />
      <GenericTextQuestion
        isOpen={openTextPage}
        onClose={() => {
          setOpenTextPage(false);
        }}
      />
      <Welcome
        isOpen={openWelcomePage}
        onClose={() => {
          setOpenWelcomePage(false);
        }}
      />
    </div>
  );
};

export default SurveyBuilder;
