import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  checkGenericTextExists,
  checkGroupMembership,
  checkSurveyExists,
  checkWorkspaceExists,
  validateEditQuestion,
  validateNewQuestion,
} from "../middlewares/genericTextMiddleware";
import {
  addGenericQuestion,
  deleteGenericQuestion,
  duplicateGenericText,
  editGenericText,
  getGenericQuestion,
} from "../controllers/genericTextController";
import { checkGroupMembershipFowWorkspace } from "../middlewares/workspaceMiddleware";
import { checkWorkspaceExistsForSurveyBuilder } from "../middlewares/welcomePartMiddleware";

const genericTextRouter = Router();

genericTextRouter.post(
  "/add",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  validateNewQuestion,
  addGenericQuestion
);

genericTextRouter.get(
  "/get",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  getGenericQuestion
);

genericTextRouter.delete(
  "/delete/:questionId",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  checkGenericTextExists,
  deleteGenericQuestion
);

genericTextRouter.post(
  "/duplicate/:questionId",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  checkGenericTextExists,
  duplicateGenericText
);

genericTextRouter.put(
  "/edit/:questionId",
  authUser,
  checkWorkspaceExistsForSurveyBuilder,
  checkGroupMembershipFowWorkspace,
  checkSurveyExists,
  validateEditQuestion,
  editGenericText
);

export default genericTextRouter;
