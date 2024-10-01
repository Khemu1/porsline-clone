import { Response, Request, NextFunction } from "express";
import { NewGroup } from "../types/types";
import { CustomError } from "../errors/customError";
import User from "../db/models/User";

export const NewGroupValidation = async (
  req: Request<{}, {}, NewGroup>,
  res: Response<{}, { invitedUsers: User[] }>,
  next: NextFunction
) => {
  try {
    const data = req.body;

    if (!Array.isArray(data.invitedUsers) || data.invitedUsers.length === 0) {
      throw new CustomError("Invalid invited users", 400, true);
    }

    const invitedUsernames = data.invitedUsers;
    const foundUsers = await User.findAll({
      where: { username: invitedUsernames },
    });

    if (foundUsers.length !== invitedUsernames.length) {
      throw new CustomError("Some invited users do not exist", 400, true);
    }

    res.locals.invitedUsers = foundUsers;
    next();
  } catch (error) {
    next(error);
  }
};
