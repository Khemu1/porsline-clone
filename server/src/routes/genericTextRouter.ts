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

genericTextRouter.put(
  "/edit/:questionId",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  validateEditQuestion,
  editGenericText,
);

export default genericTextRouter;
