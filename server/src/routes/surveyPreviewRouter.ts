import { Router } from "express";
import { getSurveyPreview } from "../controllers/surveyPreviewController";
import { checkSurveyExists, checkSurveyExistsForPreview } from "../middlewares/surveyMiddleware";

const surveyPreviewRouter = Router();

surveyPreviewRouter.get("/:surveyPath", checkSurveyExistsForPreview, getSurveyPreview);

export default surveyPreviewRouter;
