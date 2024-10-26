import { NextFunction, Request, Response } from "express";
import { getSurveyPreviewService } from "../services/surveyPreviewService";

export const getSurveyPreview = async (
  req: Request<{ surveyId: string }, {}, {}>,
  res: Response<{}, {}>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    console.log("in controller", surveyId);
    const surveyPreview = await getSurveyPreviewService(+surveyId);
    return res.status(200).json(surveyPreview);
  } catch (error) {
    next(error);
  }
};
