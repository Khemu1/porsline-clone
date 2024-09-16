import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { verifyToken } from "../services/jwtService";
import { RolesProps } from "../types/types";

const authUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    let idToken = req.headers.authorization?.split(" ")[1];
    if (!idToken) {
      throw new CustomError("No Access Token Found", 401, true);
    }
    const tokenData = verifyToken(idToken);
    if (!tokenData || !tokenData.id) {
      throw new CustomError("Invalid Token", 401, true);
    }
    // since setting headers in a middleware does not persist them to the next request
    // instead use cookies or locals
    res.locals.userId = tokenData.id;
    res.locals.userType = tokenData.userType;

    next();
  } catch (error) {
    next(error);
  }
};

const restrictTo = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userType = res.locals.userType;

      if (!allowedTypes.includes(userType)) {
        return next(
          new CustomError(
            "You don't have permission to access this action",
            403,
            true
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export { authUser, restrictTo };
