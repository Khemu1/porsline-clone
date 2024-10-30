import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  addWorkSpace,
  deleteWorkspace,
  getWorkSpaces,
  updateWorkspaceTitle,
} from "../controllers/workspaceController";
import {
  checkWorkspaceTitle,
  checkGroupMembershipFowWorkspace,
  checkWorkspaceExists,
} from "../middlewares/workspaceMiddleware";

const workspaceRouter = Router();

workspaceRouter.post("/add-workspace", authUser, addWorkSpace);
workspaceRouter.get("/get-workspaces", authUser, getWorkSpaces);
workspaceRouter.patch(
  "/:workspaceId/update-title",
  authUser,
  checkWorkspaceExists,
  checkGroupMembershipFowWorkspace,
  checkWorkspaceTitle,
  updateWorkspaceTitle
);
workspaceRouter.delete(
  "/:workspaceId/delete",
  authUser,
  checkWorkspaceExists,
  checkGroupMembershipFowWorkspace,
  deleteWorkspace
);

export default workspaceRouter;
