import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  checkSurveyExists,
  checkGroupMembership,
  validateNewWelcomePart,
  validateEditWelcomePart,
  checkWorkspaceExistsForSurveyBuilder,
} from "../middlewares/welcomePartMiddleware";
import {
  addWelcomePart,
  deleteWelcomePart,
  duplicateWelcomePart,
  editWelcomePart,
} from "../controllers/welcomePartController";
import { checkGroupMembershipFowWorkspace } from "../middlewares/workspaceMiddleware";

const welcomePartRouter = Router();

welcomePartRouter.get(
  "/welcome/:id",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists
);
welcomePartRouter.post(
  "/add",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  validateNewWelcomePart,
  addWelcomePart
);

welcomePartRouter.delete(
  `/delete/:welcomeId`,
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  deleteWelcomePart
);

welcomePartRouter.post(
  "/edit/:welcomeId",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  validateEditWelcomePart,
  editWelcomePart
);

export default welcomePartRouter;
