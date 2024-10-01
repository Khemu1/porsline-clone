import { NextFunction, Request, Response } from "express";
import { NewSurvey } from "../types/types";
import { addSurveyService, getSurveyService } from "../services/surveyService";

export const addSurvey = async (
  req: Request<{ workspaceId: string }, {}, NewSurvey>,
  res: Response<{}, { userId: number }>,
  next: NextFunction
) => {
  try {
    const workspaceId = +req.params.workspaceId;
    const { title } = req.body;
    const surveyData = await addSurveyService(workspaceId, title);
    res.status(201).json(surveyData);
  } catch (error) {
    next(error);
  }
};
export const getSurvey = async (
  req: Request<{ workspaceId: string }, {}, {}>,
  res: Response<{}, { userId: number }>,
  next: NextFunction
) => {
  try {
    const workspaceId = +req.params.workspaceId;
    const surveyData = await getSurveyService(workspaceId);
    res.status(201).json(surveyData);
  } catch (error) {
    next(error);
  }
};
