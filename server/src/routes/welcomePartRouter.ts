import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  checkSurveyExists,
  checkWorkspaceExists,
  checkGroupMembership,
  validateNewWelcomePart,
} from "../middlewares/welcomePartMiddleware";
import {
  addWelcomePart,
  deleteWelcomePart,
  duplicateWelcomePart,
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

// welcomePartRouter.post(
//   "/duplicate",
//   authUser,
//   checkWorkspaceExists,
//   checkGroupMembership,
//   checkSurveyExists,
//   checkWorkspaceExists,
// );

export default welcomePartRouter;
