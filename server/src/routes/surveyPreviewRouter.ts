import { Router } from "express";
import { getSurveyPreview } from "../controllers/surveyPreviewController";
import { checkSurveyExists } from "../middlewares/surveyMiddleware";

const surveyPreviewRouter = Router();

surveyPreviewRouter.get("/:surveyId", checkSurveyExists, getSurveyPreview);

export default surveyPreviewRouter;