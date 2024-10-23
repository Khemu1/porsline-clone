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
  checkWorkspaceExistsForSurvey,
  validateNewSurvey,
  validateSurveyForMoving,
} from "../middlewares/surveyMiddleware";
import { checkGroupMembership } from "../middlewares/groupMiddleware";

const surveyRouter = Router();

surveyRouter.get(
  "/:workspaceId/:surveyId",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkGroupMembership,
  checkSurveyExists,
  getSurvey
);

surveyRouter.post(
  "/add-survey",
  authUser,
  checkWorkspaceExistsForSurvey,
  validateNewSurvey,
  checkGroupMembership,
  checkDuplicateSurveyTitle,
  addSurvey
);

surveyRouter.patch(
  "/:surveyId/update-title",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembership,
  checkDuplicateSurveyTitle,
  updateSurveyTitle
);

surveyRouter.patch(
  "/:surveyId/update-status",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembership,
  updateSurvyStatus
);

surveyRouter.patch(
  "/:surveyId/update-url",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembership,
  checkDuplicateSurveyUrl,
  updateSurveyUrl
);

surveyRouter.delete(
  "/:surveyId/delete",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembership,
  deleteSurvey
);

surveyRouter.post(
  "/:surveyId/duplicate",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembership,
  validateSurveyForMoving,
  duplicateSurvey
);

surveyRouter.patch(
  "/:surveyId/move",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembership,
  validateSurveyForMoving,
  moveSurvey
);
export default surveyRouter;
