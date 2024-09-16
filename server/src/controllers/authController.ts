import { Request, Response } from "express";
import { addUser, getUser } from "../services/userService";
import { RolesProps, signInParams, SignUpParams } from "../types/types";
import { generateToken } from "../services/jwtService";
import { NextFunction } from "connect";
import { CustomError } from "../errors/customError";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, role } = req.body as SignUpParams;

    if (
      !username ||
      !email ||
      !password ||
      (role &&
        !Object.values(RolesProps).includes(
          role.toLocaleLowerCase() as RolesProps
        ))
    ) {
      throw new CustomError("Missing or invalid User values", 401, true);
    }

    const user = await addUser({ username, email, password, role });
    const jwtToken = generateToken({ id: user.id, userType: user.role });
    return res
      .status(201)
      .json({ message: "User created successfully", user, jwtToken });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { usernameOrEmail, password } = req.body as signInParams;
    if (!usernameOrEmail || !password) {
      throw new CustomError("Missing User values", 401, true);
    }
    const user = await getUser({ usernameOrEmail, password });
    const jwtToken = generateToken({ id: user.id, userType: user.role });
    return res.status(200).json({ user: user, jwtToken });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn };
