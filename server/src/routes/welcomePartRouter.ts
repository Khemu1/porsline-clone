import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  checkSurveyExists,
  checkWorkspaceExists,
  checkGroupMembership,
  validateNewWelcomePart,
} from "../middlewares/welcomePartMiddleware";
import { addWelcomePart } from "../controllers/welcomePartController";

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

export default welcomePartRouter;
