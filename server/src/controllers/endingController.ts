import { Request, Response, NextFunction } from "express";
import {
  CustomEndingModel,
  DefaultEndingModel,
  NewCustomEnding,
  NewDefaultEnding,
} from "../types/types";
import {
  addEndingService,
  deleteEndingService,
  duplicateEndingService,
  editEndingService,
} from "../services/endingService";
import DefaultEnding from "../db/models/DefaultEnding";
import CustomEnding from "../db/models/CustomEnding";
import exp from "constants";

export const addEnding = async (
  req: Request<
    { endingId: string; type: "default" | "custom" },
    {},
    {
      workspaceId: string;
      surveyId: string;
      type: "default" | "custom";
      defaultEnding: boolean;
    }
  >,
  res: Response<
    {},
    {
      newEnding: NewDefaultEnding | NewCustomEnding;
      workspaceId: string;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const { newEnding } = res.locals;
    const { type } = req.body;

    const {
      ending,
      default: defaultEnding,
      type: endingType,
    } = await addEndingService(newEnding, type);
    return res.status(201).json({ ending, type: endingType, defaultEnding });
  } catch (error) {
    next(error);
  }
};

export const deleteEnding = async (
  req: Request<
    { endingId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      type: "default" | "custom";
      defaultEnding: boolean;
    }
  >,
  res: Response<
    {},
    {
      newEnding: NewDefaultEnding | NewCustomEnding;
      workspaceId: string;
      userId: string;
      groupId: string;
      ending: DefaultEnding | CustomEnding;
    }
  >,
  next: NextFunction
) => {
  try {
    const { endingId } = req.params;
    const { type } = req.body;
    await deleteEndingService(+endingId, type);
    return res.status(200).json({ endingId, type });
  } catch (error) {
    next(error);
  }
};

export const duplicateEnding = async (
  req: Request<
    { endingId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      type: "default" | "custom";
      defaultEnding: boolean;
    }
  >,
  res: Response<
    {},
    {
      newEnding: NewDefaultEnding | NewCustomEnding;
      workspaceId: string;
      userId: string;
      groupId: string;
      ending: DefaultEndingModel | CustomEndingModel;
    }
  >,
  next: NextFunction
) => {
  try {
    const { ending } = res.locals;
    const { type } = req.body;

    const newEnding = await duplicateEndingService(ending, type);
    return res.status(201).json({ ending: newEnding, type });
  } catch (error) {
    next(error);
  }
};

export const editEnding = async (
  req: Request<
    { endingId: string; type: "default" | "custom" },
    {},
    {
      workspaceId: string;
      surveyId: string;
      type: "default" | "custom";
      defaultEnding: boolean;
      currentEndingType: "default" | "custom";
    }
  >,
  res: Response<
    {},
    {
      editEnding: DefaultEndingModel | CustomEndingModel;
      workspaceId: string;
      userId: string;
      groupId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const { editEnding } = res.locals;
    const { endingId } = req.params;
    const { currentEndingType } = req.body;
    const ending = await editEndingService(
      editEnding,
      +endingId,
      currentEndingType
    );
    return res
      .status(200)
      .json({ ending, prevType: currentEndingType, prevId: +endingId });
  } catch (error) {
    next(error);
  }
};
