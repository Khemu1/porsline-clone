import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import {
  addWorkSpace,
  getWorkSpaces,
  updateWorkspaceTitle,
} from "../controllers/workspaceController";
import { checkWorkspaceExists } from "../middlewares/workspaceMiddleware";
import { checkGroupMembership } from "../middlewares/groupMiddleware";
import { updateWorkspaceTitleService } from "../services/workspaceService";

const workspaceRouter = Router();

workspaceRouter.post("/add-workspace", authUser, addWorkSpace);
workspaceRouter.get("/get-workspaces", authUser, getWorkSpaces);
workspaceRouter.patch(
  "/:workspaceId/update-title",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
  updateWorkspaceTitle
);
workspaceRouter.delete(
  "/:workspacesId/delete",
  authUser,
  checkWorkspaceExists,
  checkGroupMembership,
);

export default workspaceRouter;
