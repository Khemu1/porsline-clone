import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { verifyToken } from "../services/jwtService";
import UserGroup from "../db/models/UserGroup";
import WorkSpace from "../db/models/WorkSpace";

export const authUser = (
  req: Request,
  res: Response<
    {},
    { userId: string; workspaceId: string; }
  >,
  next: NextFunction
) => {
  try {
    const idToken = req.cookies.jwt;

    if (!idToken) {
      throw new CustomError(
        "No Access Token Found",
        401,
        true,
        "premissionDenied"
      );
    }

    const tokenData = verifyToken(idToken);
    if (!tokenData || !tokenData.id) {
      throw new CustomError("Invalid Token", 401, true, "premissionDenied");
    }

    res.locals.userId = tokenData.id.toString();

    next();
  } catch (error) {
    next(error);
  }
};
