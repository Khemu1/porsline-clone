import { Router } from "express";
import {
  addEnding,
  deleteEnding,
  duplicateEnding,
  editEnding,
} from "../controllers/endingController";
import {
  checkEndingExists,
  checkGroupMembership,
  checkSurveyExists,
  checkWorkspaceExists,
  validateEditEnding,
  validateNewEnding,
} from "../middlewares/endingMiddleware";
import { authUser } from "../middlewares/authMiddleware";
import { checkGroupMembershipFowWorkspace } from "../middlewares/workspaceMiddleware";
import { checkWorkspaceExistsForSurveyBuilder } from "../middlewares/welcomePartMiddleware";

const endingsRouter = Router();

endingsRouter.post(
  "/add",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  validateNewEnding,
  addEnding
);

endingsRouter.delete(
  "/delete/:endingId",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  deleteEnding
);

endingsRouter.post(
  "/duplicate/:endingId",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  checkEndingExists,
  duplicateEnding
);

endingsRouter.put(
  "/edit/:endingId",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  validateEditEnding,
  editEnding
);

export default endingsRouter;
