import { Router } from "express";
import { authUser, checkUserInGroup } from "../middlewares/authMiddleware";
import {
  addSurvey,
  deleteSurvey,
  getSurvey,
  updateSurveyTitle,
  updateSurveyUrl,
  updateSurvyStatus,
} from "../controllers/surveyController";
import {
  checkDuplicateSurveyTitle,
  checkDuplicateSurveyUrl,
  checkSurveyExists,
  validateNewSurvey,
} from "../middlewares/surveyMiddleware";
import { checkWorkspaceExists } from "../middlewares/workspaceMiddleware";

const surveyRouter = Router();

surveyRouter.post(
  "add-survey/:workspaceId",
  authUser,
  validateNewSurvey,
  addSurvey
);
// surveyRouter.get("get-survey/:surveyId", checkSurveyExists, getSurvey);

surveyRouter.patch(
  "/:surveyId/update-title",
  authUser,
  checkWorkspaceExists,
  checkUserInGroup,
  checkSurveyExists,
  checkDuplicateSurveyTitle,
  updateSurveyTitle
);

surveyRouter.patch(
  "/:surveyId/update-status",
  authUser,
  checkWorkspaceExists,
  checkUserInGroup,
  checkSurveyExists,
  updateSurvyStatus
);

surveyRouter.patch(
  "/:surveyId/update-url",
  authUser,
  checkWorkspaceExists,
  checkUserInGroup,
  checkSurveyExists,
  checkDuplicateSurveyUrl,
  updateSurveyUrl
);

surveyRouter.delete(
  "/:surveyId/delete",
  authUser,
  checkWorkspaceExists,
  checkUserInGroup,
  checkSurveyExists,
  deleteSurvey
);
export default surveyRouter;
