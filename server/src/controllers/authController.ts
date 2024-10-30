import { Request, Response } from "express";
import {
  addUser,
  getUserService,
  signInService,
} from "../services/userService";
import { signInParams, SignUpParams } from "../types/types";
import { generateToken } from "../services/jwtService";
import { NextFunction } from "connect";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

    const { username, password } = req.body as SignUpParams;

    const user = await addUser({ username, password, currentLang });
    const jwtToken = generateToken({ id: user.id });
    return res
      .status(201)
      .json({ message: "User created successfully", user, jwtToken });
  } catch (error) {
    next(error);
  }
};

const signIn = async (
  req: Request<{}, {}, signInParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";
    const { username, password } = req.body as signInParams;
    const user = await signInService({ username, password, currentLang });

    const jwtToken = generateToken({
      id: user.id,
      groups: user.userGroups,
      userGroup: user.createdGroup,
    });

    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 90 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserData = async (
  req: Request,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { userId } = res.locals;
    const user = await getUserService(+userId);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn };
