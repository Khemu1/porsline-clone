import React, { useEffect, useState } from "react";
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
import { current } from "@reduxjs/toolkit";

const Share = () => {
  const [text, setText] = useState("");
  const currentSurvey = useSelector(
    (state: RootState) => state.currentSurvey.currentSurvey
  );
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const {}

  useEffect(() => {
    const storedSurvey = localStorage.getItem("currentSurvey") ?? "";

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
  }, []);

  useEffect(() => {
    if (currentSurvey?.url) {
      setText(currentSurvey.url ?? "");
    }
  }, [currentSurvey]);

  console.log(currentSurvey);

  return (
    <div className="flex flex-col gap-3 main_text p-3">
      <span className="main_text_bold text-xl">{t("share")}</span>
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-[400px]"
        />
        <button className="bg-[#4b6ef5] px-4 py-2 rounded-md text-sm font-semibold transition-all hover:bg-[#3d37a9]">
          {t("change")}
        </button>{" "}
      </div>
    </div>
  );
};

export default Share;
