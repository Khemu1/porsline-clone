import { Router } from "express";
import { authUser } from "../middlewares/authMiddleware";
import { findUser, lookForUserInGroup } from "../middlewares/groupMiddleware";
import { addToGroup, removeFromGroup } from "../controllers/groupController";

const groupRouter = Router();
groupRouter.post("/add-user", authUser, findUser, addToGroup);
groupRouter.delete(
  "/remove-user",
  authUser,
  lookForUserInGroup,
  removeFromGroup
);

export default groupRouter;
