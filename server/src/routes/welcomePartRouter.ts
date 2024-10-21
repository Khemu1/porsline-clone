import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  checkSurveyExists,
  checkWorkspaceExists,
  checkGroupMembership,
  validateNewWelcomePart,
  validateEditWelcomePart,
} from "../middlewares/welcomePartMiddleware";
import {
  addWelcomePart,
  deleteWelcomePart,
  duplicateWelcomePart,
  editWelcomePart,
} from "../controllers/welcomePartController";

const welcomePartRouter = Router();
// body -> workspaceId, surveyId
//find workspace --> survey
// permission
//return welcomePart
welcomePartRouter.get(
  "/welcome/:id",
  authUser,
  checkGroupMembership,
  checkWorkspaceExists,
  checkSurveyExists
);
welcomePartRouter.post(
  "/add",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  validateNewWelcomePart,
  addWelcomePart
);

welcomePartRouter.delete(
  `/delete/:welcomeId`,
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  checkWorkspaceExists,
  deleteWelcomePart
);

welcomePartRouter.post(
  "/edit/:welcomeId",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  validateEditWelcomePart,
  editWelcomePart,
);

export default welcomePartRouter;
