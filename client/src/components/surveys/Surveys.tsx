import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSurvey } from "../../store/slices/currentSurveySlice";
import { RootState } from "../../store/store";
import { SurveyModel } from "../../types";
import Survey from "../surveys/survey";

const Surveys = () => {
  
  const dispatch = useDispatch();
  const surveys = useSelector((state: RootState) => state.survey.surveys);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyModel | null>(
    null
  );

  useEffect(() => {
    if (surveys && surveys.length > 0) {
      setSelectedSurvey(surveys[0]);
      dispatch(setCurrentSurvey(surveys[0]));
    }
  }, [surveys, dispatch]);

  const handleSurveySelect = (survey: SurveyModel) => {
    setSelectedSurvey(survey);
    dispatch(setCurrentSurvey(survey));
  };

  return (
    <div className="flex flex-col gap-5 overflow-scroll">
      <div className="flex items-center justify-center gap-5 w-[292px] h-[212px] bg-[#1d2022] rounded-lg">
        <button className="w-max h-max p-1 bg-[#859fd1] rounded-md">
          <img
            src="/assets/icons/plus.svg"
            alt="plus"
            className="w-[20px] h-[20px]"
          />
        </button>
        <p className="text-[#859fd1] font-semibold">Create new survey</p>
      </div>
      {surveys?.map((survey) => (
        <Survey
          key={survey.id}
          selected={selectedSurvey?.id === survey.id} 
          survey={survey}
          onSelect={handleSurveySelect} 
        />
      ))}
    </div>
  );
};

export default Surveys;
