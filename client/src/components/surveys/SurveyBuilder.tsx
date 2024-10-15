import { useLanguage } from "../lang/LanguageProvider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Welcome from "../question/welcome/weclome";
import GenericTextQuestion from "../question/genericText/GenericTextQuestion";
import Endings from "../question/endings/Endings";
import { useEffect, useState } from "react";
import { useGetSurvey } from "../../hooks/survey";
import { useParams } from "react-router-dom";
import { updateWelcomePart } from "../../store/slices/welcomePartSlice";

const SurveyBuilder = () => {
  const { workspaceId, surveyId } = useParams();
  const { t, getCurrentLanguageTranslations, getCurrentLanguage } =
    useLanguage();
  const dispatch = useDispatch();
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const currentWelcomePart = useSelector(
    (state: RootState) => state.welcomePart
  );
  const welcomePartState = useSelector((state: RootState) => state.welcomePart);

  const [openWelcomePage, setOpenWelcomePage] = useState(false);
  const [openTextPage, setOpenTextPage] = useState(false);
  const [openEndingsPage, setOpenEndingsPage] = useState(false);

  const { survey, isError, isLoading, errorState } = useGetSurvey(
    Number(workspaceId),
    Number(surveyId),
    getCurrentLanguageTranslations,
    getCurrentLanguage()
  );
  useEffect(() => {
    if (
      survey?.welcomePart &&
      survey.welcomePart.length > 0 &&
      !currentWelcomePart.id
    ) {
      dispatch(updateWelcomePart(survey.welcomePart[0]));
      console.log("currentWelcomePart", survey.welcomePart[0]);
    }
  }, [survey]);
  return (
    <div className="survey_builder">
      <aside>
        <div className="flex flex-col items-center gap-5 mb-5 relative w-full">
          <div
            className="flex items-center justify-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl "
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
          </div>

          {/* Open Generic Text Page */}
          <div
            className="flex justify-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl"
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
            className="flex justify-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl"
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

      <section>
        <div className="flex flex-col justify-center items-end gap-5 mb-5 relative w-full">
          <div className="w-full">
            {welcomePartState.id ? (
              <div
                className="flex justify-start py-1 px-3 gap-2 rounded-lg w-full cursor-pointer"
                onClick={() => setOpenWelcomePage(true)}
              >
                <div className="survey_builder_icon_welcome_style">
                  <img
                    src="/assets/icons/welcome.svg"
                    alt="welcome"
                    className="w-[30px]"
                  />
                </div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: welcomePartState.label ?? "",
                  }}
                ></p>
              </div>
            ) : (
              <div
                className="welcome_page_style "
                onClick={() => setOpenWelcomePage(true)}
              >
                <img
                  src="/assets/icons/plus.svg"
                  alt="plus"
                  className="w-[20px]"
                />
                <p>{t("welcomePage")}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col w-full gap-3">
            <div>questions</div>
            <div>questions</div>
            <div>questions</div>
          </div>
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
