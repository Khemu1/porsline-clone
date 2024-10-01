import { Request, Response } from "express";
import { addUser, getUser } from "../services/userService";
import { signInParams, SignUpParams } from "../types/types";
import { generateToken } from "../services/jwtService";
import { NextFunction } from "connect";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as SignUpParams;

    const user = await addUser({ username, password });
    const jwtToken = generateToken({ id: user.id, });
    return res
      .status(201)
      .json({ message: "User created successfully", user, jwtToken });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request<{},{},signInParams>, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as signInParams;
    const user = await getUser({ username, password });
    const jwtToken = generateToken({ id: user.id });
    return res.status(200).json({ user: user, jwtToken });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn };
