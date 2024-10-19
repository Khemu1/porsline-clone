import { Router } from "express";
import {
  addEnding,
  deleteEnding,
  duplicateEnding,
} from "../controllers/endingController";
import {
  checkEndingExists,
  checkGroupMembership,
  checkSurveyExists,
  checkWorkspaceExists,
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
  checkEndingExists,
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

export default endingsRouter;
