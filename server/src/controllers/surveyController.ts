import { NextFunction, Request, Response } from "express";
import { NewSurvey } from "../types/types";
import {
  addSurveyService,
  deleteSurveyService,
  getSurveyService,
  updateSurveyStatusService,
  updateSurveyTitleService,
  updateSurveyUrlService,
} from "../services/surveyService";

export const addSurvey = async (
  req: Request<{ workspaceId: string }, {}, NewSurvey>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const workspaceId = +req.params.workspaceId;
    const { title } = req.body;
    const surveyData = await addSurveyService(workspaceId, title);
    res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const getSurvey = async (
  req: Request<{ surveyId: string }, {}, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const surveyData = await getSurveyService(+surveyId);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurveyTitle = async (
  req: Request<{ surveyId: string }, {}, { title: string }>,
  res: Response<{}, { userId: string; workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { title } = req.body;
    const surveyData = await updateSurveyTitleService(+surveyId, title);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurvyStatus = async (
  req: Request<{ surveyId: string }, { isActive: boolean; title: string }>,
  res: Response<{}, { workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { isActive } = req.body;
    const surveyData = await updateSurveyStatusService(+surveyId, isActive);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurveyUrl = async (
  req: Request<
    { surveyId: string },
    { url: string; isActive: boolean; title: string }
  >,
  res: Response<{}, { workspaceId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { url } = req.body;
    const surveyData = await updateSurveyUrlService(+surveyId, url);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const deleteSurvey = async (
  req: Request<{ surveyId: string }, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    await deleteSurveyService(+surveyId);
    return res.status(204);
  } catch (error) {
    next(error);
  }
};
