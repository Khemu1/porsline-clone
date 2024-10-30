import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { verifyToken } from "../services/jwtService";
import UserGroup from "../db/models/UserGroup";
import { UserGroupModel, UserModel } from "../types/types";
import { getTranslation } from "../utils";

export const authUser = async (
  req: Request,
  res: Response<
    {},
    {
      userId: string;
      workspaceId: string;
      groupMembers?: UserGroupModel[];
      groupId: string;
      user: UserModel;
    }
  >,
  next: NextFunction
) => {
  try {
    const currentLanguage =
      (req.headers["accept-language"] as "en" | "de") ?? "en";
    const idToken = req.cookies.jwt;

    if (!idToken) {
      throw new CustomError(
        getTranslation(currentLanguage, "unexpectedError"),
        401,
        true,
        "premissionDenied"
      );
    }

    const tokenData = verifyToken(idToken);
    if (
      !tokenData ||
      !tokenData.id ||
      tokenData.groups === null ||
      tokenData.groups === undefined
    ) {
      throw new CustomError(
        getTranslation(currentLanguage, "unexpectedError"),
        401,
        true,
        "premissionDenied"
      );
    }
    res.locals.groupMembers = undefined;
    if (tokenData.userGroup) {
      const groupMebers = await UserGroup.findAll({
        where: {
          groupId: tokenData.userGroup.id,
        },
      });
      res.locals.groupMembers = groupMebers.map((groupMmeber) =>
        groupMmeber.get({ plain: true })
      );
    }

    res.locals.userId = tokenData.id.toString();

    next();
  } catch (error) {
    next(error);
  }
};
