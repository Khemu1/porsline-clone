import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../lang/LanguageProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Welcome from "../question/welcome/weclome";
import GenericTextQuestion from "../question/genericText/GenericTextQuestion";
import Endings from "../question/endings/Endings";
const SurveyBuilder = () => {
  const NavigatTo = useNavigate();

  const { t, getCurrentLanguageTranslations, getCurrentLanguage } =
    useLanguage();
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );

  // useEffect(() => {
  //   if (!currentSurvey) {
  //     NavigatTo("/");
  //   }
  // }, [currentSurvey]);

  return (
    <div className="survey_builder">
      <aside>
        <div className="flex flex-col items-center gap-5 mb-5 relative w-full">
          <Link
            to={`/survey/${currentSurvey?.id}/build/new`}
            className="flex justify-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl"
          >
            <div>
              <img
                src="/assets/icons/welcome.svg"
                alt="welcome"
                className="w-[30px]"
              />
            </div>
            <p>{t("welcomePage")}</p>
          </Link>
          <div className="flex justify-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl">
            <div>
              <img
                src="/assets/icons/text.svg"
                alt="welcome"
                className="w-[30px]"
              />
            </div>
            <p>{t("text")}</p>
          </div>
          <div className="flex justify-center bg-[#0e0f0f] py-1 px-3 gap-2 rounded-lg w-full cursor-pointer transition-all hover:shadow-2xl">
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
            <div className="welcome_page_style">
              <img
                src="/assets/icons/plus.svg"
                alt="plus"
                className="w-[20px]"
              />
              <p>{t("welcomePage")}</p>
            </div>
          </div>
          <div className="flex flex-col w-full gap-3">
            <div>questions</div>
            <div>questions</div>
            <div>questions</div>
          </div>
          <div className="w-full">
            <div className="welcome_page_style">
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
        isOpen={true}
        onClose={() => {
          console.log("Closing welcome page");
        }}
      />
      {/* <GenericTextQuestion
        isOpen={true}
        onClose={() => {
          console.log("Closing welcome page");
        }}
      /> */}
      {/* <Welcome
        isOpen={true}
        onClose={() => {
          console.log("Closing welcome page");
        }}
      /> */}
    </div>
  );
};

export default SurveyBuilder;
