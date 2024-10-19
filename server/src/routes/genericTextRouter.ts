import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  checkGenericTextExists,
  checkGroupMembership,
  checkSurveyExists,
  checkWorkspaceExists,
  validateNewQuestion,
} from "../middlewares/genericTextMiddleware";
import {
  addGenericQuestion,
  deleteGenericQuestion,
  duplicateGenericText,
  getGenericQuestion,
} from "../controllers/genericTextController";

const genericTextRouter = Router();

genericTextRouter.post(
  "/add",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  validateNewQuestion,
  addGenericQuestion
);

genericTextRouter.get(
  "/get",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  getGenericQuestion
);

genericTextRouter.delete(
  "/delete/:questionId",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  checkGenericTextExists,
  deleteGenericQuestion
);

genericTextRouter.post(
  "/duplicate/:questionId",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  checkGenericTextExists,
  duplicateGenericText
);

export default genericTextRouter;
