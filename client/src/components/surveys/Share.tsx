import React from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";

const Share = () => {
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  console.log(currentSurvey);
  return <div>Share</div>;
};

export default Share;
