import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import { getGroup } from "../controllers/groupController";

const groupRouter = Router();
groupRouter.post("/create-group");
groupRouter.get("/get-group", authUser, getGroup);
groupRouter.delete("/delete-group-member");

export default groupRouter;
