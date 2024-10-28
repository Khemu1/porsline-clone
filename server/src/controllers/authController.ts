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
    const { username, password } = req.body as SignUpParams;

    const user = await addUser({ username, password });
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
    const { username, password } = req.body as signInParams;
    const user = await signInService({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" }); // Handle invalid user case
    }

    const jwtToken = generateToken({
      id: user.id,
      groups: user.userGroups,
      userGroup: user.createdGroup,
    });

    // Set the cookie with a 90-day expiration
    res.cookie("jwt", jwtToken, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
      sameSite: "strict", // Prevent CSRF attacks
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
