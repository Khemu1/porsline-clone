import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../lang/LanguageProvider";
import { useGetForPreviewSurvey } from "../../hooks/surveyPreview";
import {
  CustomEndingModel,
  DefaultEndingModel,
  GenericTextModel,
  WelcomePartModel,
} from "../../types";
import WelcomePartPreview from "./welcomePartPreview";
import PreviewQuestion from "./PreviewQuestion";
import SurveyEndingPreview from "./SurveyEndingPreview";

const SurveyPreview = () => {
  const { t } = useLanguage();
  const { surveyPath } = useParams();
  const { getCurrentLanguageTranslations, getCurrentLanguage } = useLanguage();

  const [welcomePart, setWelcomePart] = useState<WelcomePartModel | null>(null);
  const [questions, setQuestions] = useState<GenericTextModel[]>([]);
  const [requiredError, setRequiredError] = useState(false);
  const [ending, setEnding] = useState<
    CustomEndingModel | DefaultEndingModel | null
  >(null);

  const [current, setCurrent] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] = useState<
    { questionId: number; response: string }[]
  >([]);

  const { survey, isLoading } = useGetForPreviewSurvey(
    surveyPath ?? "",
    getCurrentLanguageTranslations,
    getCurrentLanguage()
  );

  useEffect(() => {
    if (survey) {
      const welcomePartData = survey.welcomePart ?? null;
      setWelcomePart(welcomePartData);
      setQuestions(survey.questions ?? []);
      setEnding(survey.ending ?? null);

      if (!welcomePartData) {
        setCurrent(1);
      }

      setResponses(
        survey.questions?.map((question) => ({
          questionId: question.id,
          response: "",
        })) || []
      );
    }
  }, [survey]);

  useEffect(() => {
    if (current === 1 && currentIndex >= questions.length) {
      setCurrent(2);
    }
  }, [current, currentIndex, questions.length]);

  useEffect(() => {
    if (current === 0 && welcomePart && !welcomePart.buttonText) {
      console.log("no button text");
      setTimeout(() => {
        setCurrent(1);
      }, 1500);
    }
  }, [current]);

  const handleNext = () => {
    if (current === 0) {
      setCurrent(1);
    } else if (current === 1) {
      const questionReponse = responses.find(
        (response) => response.questionId === questions[currentIndex].id
      );
      if (questions[currentIndex].required && !questionReponse?.response) {
        setRequiredError(true);
      } else {
        if (requiredError) {
          setRequiredError(false);
        }
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (current === 1 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleResponseChange = (value: string) => {
    setResponses((prev) =>
      prev.map((res, index) =>
        index === currentIndex ? { ...res, response: value } : res
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!survey) {
    return <div>Survey not found</div>;
  }
  console.log("SurveyPreview", survey);
  return (
    <div className="flex flex-col h-[100dvh] w-full justify-between">
      <div className="flex-1 flex flex-col justify-center items-center">
        {current === 0 && welcomePart && (
          <WelcomePartPreview
            {...welcomePart}
            preview={true}
            next={handleNext}
          />
        )}
        {current === 1 &&
          questions.length > 0 &&
          currentIndex < questions.length && (
            <div className="flex flex-col justify-center flex-1">
              <PreviewQuestion
                {...questions[currentIndex]}
                hideQuestionNumber={questions[currentIndex].hideQuestionNumber}
                regex={questions[currentIndex].generalRegex?.regex}
                regexPlaceHolder={
                  questions[currentIndex].generalRegex?.regexPlaceHolder
                }
                regexErrorMessage={
                  questions[currentIndex].generalRegex?.regexErrorMessage
                }
                imageUrl={questions[currentIndex].imageUrl}
                max={questions[currentIndex].generalText?.max}
                min={questions[currentIndex].generalText?.min}
                index={currentIndex + 1}
                isRequired={questions[currentIndex].required}
                savedResponse={
                  responses.find(
                    (res) => res.questionId === questions[currentIndex].id
                  )?.response || ""
                }
                onResponseChange={handleResponseChange}
              />
              {requiredError && (
                <span className="text-red-600 font-semibold">
                  {t("requiredAnswer")}
                </span>
              )}
              <div className="flex justify-between mt-4">
                <button
                  className="bg-[#0a7091] text-white w-[150px] p-2 rounded-md transition-all hover:scale-105"
                  onClick={handleNext}
                >
                  Ok
                </button>{" "}
              </div>
            </div>
          )}
        {current === 2 && ending && <SurveyEndingPreview {...ending} />}
        {current === 2 && !ending && (
          <div className="text-center flex flex-col gap-5 items-center text-xl main_text bg-[#1a1b1d] py-8 px-5 w-[430px] rounded-md">
            <p className=" main_text_bold mb-4 whitespace-normal text-wrap">
              {t("suervyEndingHeader")}.
            </p>
            <p>{t("surveyEndingbody")}.</p>
            <Link to="/" className="bg-[#262A2B] w-[83%] p-2 rounded-md">
              {t("surveyEndingButton1")}
            </Link>
            <Link to="#" className="input_border w-[85%] p-2 rounded-md">
              {t("surveyEndingButton2")}
            </Link>
          </div>
        )}
      </div>
      {current === 1 && (
        <div className="flex w-full justify-between items-center gap-4 mb-4 px-3 pt-4 border-t border-t-[#0a6f9127]">
          <div className="flex bg-[#0a7091] rounded-md">
            <button
              className=" p-2 border-r border-r-[#91929242]"
              onClick={handleNext}
            >
              <img src="/assets/icons/up-arrow.svg" alt="Next Question" />
            </button>
            <button
              className={` p-2  ${
                currentIndex > 0 ? "" : "opacity-50"
              } transition-all`}
              onClick={handleBack}
            >
              <img src="/assets/icons/down-arrow.svg" alt="Previous Question" />
            </button>
          </div>
          <span className="bg-[#0a7091] text-white font-semibold p-2 rounded-md">
            Powered by Porsline
          </span>
        </div>
      )}
    </div>
  );
};

export default SurveyPreview;
