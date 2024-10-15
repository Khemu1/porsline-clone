import { NextFunction, Request, Response } from "express";
import {
  addWelcomePartService,
  getWelcomePartService,
} from "../services/welcomePart";
import { NewWelcomePart, welcomePartOptions } from "../types/types";

export const getWelcomePart = async (
  req: Request<{ welcomeId: string }, {}, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { welcomeId } = req.params;
    const welcomePartData = await getWelcomePartService(+welcomeId);
    return res.status(200).json(welcomePartData);
  } catch (error) {
    next(error);
  }
};

export const addWelcomePart = async (
  req: Request<
    { welcomeId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      welcomeData: NewWelcomePart;
      options: welcomePartOptions;
    }
  >,
  res: Response<{}, { welcomePartData: NewWelcomePart }>,
  next: NextFunction
) => {
  try {
    const { welcomePartData } = res.locals;
    console.log(welcomePartData);
    const newWelcomePartData = await addWelcomePartService(
      welcomePartData,
    );
    return res.status(200).json(newWelcomePartData);
  } catch (error) {
    next(error);
  }
};
