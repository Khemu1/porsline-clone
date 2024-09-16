import { Router } from "express";
import { signIn, signUp } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", signUp);
authRouter.get("/signin", signIn);

export default authRouter;
