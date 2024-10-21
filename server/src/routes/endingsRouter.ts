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

const endingsRouter = Router();

endingsRouter.post(
  "/add",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  validateNewEnding,
  addEnding
);

endingsRouter.delete(
  "/delete/:endingId",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  deleteEnding
);

endingsRouter.post(
  "/duplicate/:endingId",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  checkEndingExists,
  duplicateEnding
);

endingsRouter.put(
  "/edit/:endingId",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkSurveyExists,
  validateEditEnding,
  editEnding
);

export default endingsRouter;
