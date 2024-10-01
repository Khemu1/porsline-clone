import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import { addSurvey, getSurvey } from "../controllers/surveyController";
import { validateNewSurvey } from "../middlewares/surveyMiddleware";

const surveyRouter = Router();

surveyRouter.post(
  "add-survey/:workspaceId",
  authUser,
  validateNewSurvey,
  addSurvey
);
surveyRouter.get("get-survey/:workspaceId", authUser, getSurvey);
export default surveyRouter;
