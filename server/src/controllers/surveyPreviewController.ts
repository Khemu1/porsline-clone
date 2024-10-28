import { NextFunction, Request, Response } from "express";
import { getSurveyPreviewService } from "../services/surveyPreviewService";

export const getSurveyPreview = async (
  req: Request<{ surveyPath: string }, {}, {}>,
  res: Response<{}, {}>,
  next: NextFunction
) => {
  try {
    const { surveyPath } = req.params;
    const surveyPreview = await getSurveyPreviewService(surveyPath);
    return res.status(200).json(surveyPreview);
  } catch (error) {
    next(error);
  }
};
