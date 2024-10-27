import { Router } from "express";
import { getUserData, signIn, signUp } from "../controllers/authController";
import { authUser } from "../middlewares/authMiddleware";
import { get } from "http";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/user",authUser,getUserData);

export default authRouter;
