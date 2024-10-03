import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import { addWorkSpace, getWorkSpaces } from "../controllers/workspaceController";


const workspaceRouter = Router();

workspaceRouter.post("/add-workspace", authUser, addWorkSpace);
workspaceRouter.get("/get-workspaces", authUser, getWorkSpaces);

export default workspaceRouter;
