import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError";
import { verifyToken } from "../services/jwtService";

const authUser = (
  req: Request,
  res: Response<{}, { userId: number }>,
  next: NextFunction
) => {
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
    res.locals.userId = +tokenData.id;

    next();
  } catch (error) {
    next(error);
  }
};

export { authUser };
