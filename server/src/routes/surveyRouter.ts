import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  addSurvey,
  deleteSurvey,
  duplicateSurvey,
  getSurvey,
  moveSurvey,
  updateSurveyTitle,
  updateSurveyUrl,
  updateSurvyStatus,
} from "../controllers/surveyController";
import {
  checkDuplicateSurveyTitle,
  checkDuplicateSurveyUrl,
  checkSurveyExists,
  validateNewSurvey,
  validateSurveyForMoving,
} from "../middlewares/surveyMiddleware";
import { checkGroupMembership } from "../middlewares/groupMiddleware";

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
  checkSurveyExists,
  checkGroupMembership,
  checkDuplicateSurveyTitle,
  updateSurveyTitle
);

surveyRouter.patch(
  "/:surveyId/update-status",
  authUser,
  checkSurveyExists,
  checkGroupMembership,
  updateSurvyStatus
);

surveyRouter.patch(
  "/:surveyId/update-url",
  authUser,
  checkSurveyExists,
  checkGroupMembership,
  checkDuplicateSurveyUrl,
  updateSurveyUrl
);

surveyRouter.delete(
  "/:surveyId/delete",
  authUser,
  checkSurveyExists,
  checkGroupMembership,
  deleteSurvey
);

surveyRouter.post(
  "/:surveyId/duplicate",
  authUser,
  checkSurveyExists,
  checkGroupMembership,
  duplicateSurvey
);

surveyRouter.patch(
  "/:surveyId/move",
  authUser,
  checkSurveyExists,
  checkGroupMembership,
  validateSurveyForMoving,
  moveSurvey
);
export default surveyRouter;
