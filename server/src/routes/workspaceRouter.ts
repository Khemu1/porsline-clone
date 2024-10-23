import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  addWorkSpace,
  deleteWorkspace,
  getWorkSpaces,
  updateWorkspaceTitle,
} from "../controllers/workspaceController";
import {
  checkDuplicateWorkspaceTitle,
  checkWorkspaceExists,
} from "../middlewares/workspaceMiddleware";
import { checkGroupMembership } from "../middlewares/groupMiddleware";

const workspaceRouter = Router();

workspaceRouter.post("/add-workspace", authUser, addWorkSpace);
workspaceRouter.get("/get-workspaces", authUser, getWorkSpaces);
workspaceRouter.patch(
  "/:workspaceId/update-title",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  checkDuplicateWorkspaceTitle,
  updateWorkspaceTitle
);
workspaceRouter.delete(
  "/:workspaceId/delete",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  deleteWorkspace
);

export default workspaceRouter;
