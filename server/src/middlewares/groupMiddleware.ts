import { Response, Request, NextFunction } from "express";
import { NewGroup } from "../types/types";
import { CustomError } from "../errors/customError";
import User from "../db/models/User";

export const NewGroupValidation = async (
  req: Request<{}, {}, NewGroup>,
  res: Response<{}, { groupData: NewGroup }>,
  next: NextFunction
) => {
  try {
    const { invitedUsers, groupName } = req.body;

    if (
      !Array.isArray(invitedUsers) ||
      invitedUsers.length === 0 ||
      typeof groupName !== "string"
    ) {
      throw new CustomError("Invalid invited users", 400, true);
    }

    await Promise.all(
      invitedUsers.map(async (id) => {
        const user = await User.findByPk(id);
        if (!user) {
          throw new CustomError(`User not found`, 404, true);
        }
      })
    );

    res.locals.groupData = req.body;
    next();
  } catch (error) {
    next(error);
  }
};
