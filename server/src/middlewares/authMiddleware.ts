import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { verifyToken } from "../services/jwtService";
import UserGroup from "../db/models/UserGroup";
import WorkSpace from "../db/models/WorkSpace";

export const authUser = (
  req: Request,
  res: Response<{}, { userId: string }>,
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

export const checkUserInGroup = async (
  req: Request<{}, {}, {}>,
  res: Response<{}, { userId: string; workspaceId: string; groupId: string }>,
  next: NextFunction
) => {
  const { userId, workspaceId } = res.locals;

  const workspace = await WorkSpace.findOne({
    where: { id: workspaceId },
  });

  if (!workspace) {
    return next(
      new CustomError("Workspace not found", 404, true, "workspaceNotFound")
    );
  }

  const groupId = workspace.get().groupId;

  const userGroupMembership = await UserGroup.findOne({
    where: {
      userId,
      groupId,
    },
  });

  if (!userGroupMembership) {
    return next(
      new CustomError(
        "User is not a member of the group",
        403,
        true,
        "notAMemberOfGroup"
      )
    );
  }
  res.locals.groupId = userGroupMembership.groupId.toString();
  next();
};
