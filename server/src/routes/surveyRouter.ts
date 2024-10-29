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
  checkGroupMembershipForSurvey,
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
  checkGroupMembershipForSurvey,
  checkSurveyExists,
  getSurvey
);

surveyRouter.post(
  "/add-survey",
  authUser,
  checkWorkspaceExistsForSurvey,
  validateNewSurvey,
  checkGroupMembershipForSurvey,
  checkDuplicateSurveyTitle,
  addSurvey
);

surveyRouter.patch(
  "/:surveyId/update-title",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembershipForSurvey,
  checkDuplicateSurveyTitle,
  updateSurveyTitle
);

surveyRouter.patch(
  "/:surveyId/update-status",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembershipForSurvey,
  updateSurvyStatus
);

surveyRouter.patch(
  "/:surveyId/update-url",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembershipForSurvey,
  checkDuplicateSurveyUrl,
  updateSurveyUrl
);

surveyRouter.delete(
  "/:surveyId/delete",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembershipForSurvey,
  deleteSurvey
);

surveyRouter.post(
  "/:surveyId/duplicate",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkGroupMembershipForSurvey,
  checkSurveyExists,
  validateSurveyForMoving,
  duplicateSurvey
);

surveyRouter.patch(
  "/:surveyId/move",
  authUser,
  checkWorkspaceExistsForSurvey,
  checkSurveyExists,
  checkGroupMembershipForSurvey,
  validateSurveyForMoving,
  moveSurvey
);
export default surveyRouter;
