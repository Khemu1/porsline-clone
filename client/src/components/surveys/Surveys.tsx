import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSurvey } from "../../store/slices/currentSurveySlice";
import { RootState } from "../../store/store";
import { SurveyModel } from "../../types";
import Survey from "./Survey";

const Surveys = () => {
  const dispatch = useDispatch();
  const [allSurveys, setAllSurveys] = useState<SurveyModel[]>([]);
  const surveys = useSelector((state: RootState) => state.survey);
  const workspaces = useSelector(
    (state: RootState) => state.workspace.workspaces
  );
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyModel | null>(
    null
  );

  const handleSurveySelect = (survey: SurveyModel) => {
    setSelectedSurvey(survey);
    dispatch(setCurrentSurvey(survey));
  };

  useEffect(() => {
    if (surveys.surveys.length > 0) {
      setAllSurveys(surveys.surveys);
    }
  }, [surveys, workspaces]);

  return (
    <div className="flex w-full flex-wrap gap-5 overflow-scroll">
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
      {allSurveys.map((survey) => (
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
