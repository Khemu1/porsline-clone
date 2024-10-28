import { NextFunction, Request, Response } from "express";
import {
  addWelcomePartService,
  deleteWelcomePartService,
  duplicateWelcomePartService,
  editWelcomePartService,
  getWelcomePartService,
} from "../services/welcomePart";
import {
  NewWelcomePart,
  UserGroupModel,
  WelcomePartModel,
  welcomePartOptions,
} from "../types/types";
import { userSocketMap } from "../handlers/socketHandler";
import { io } from "../server";

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
  res: Response<
    {},
    {
      welcomePartData: NewWelcomePart;
      groupId: string;
      userId: string;
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { welcomePartData, groupMembers, userId } = res.locals;

    const newWelcomePartData = await addWelcomePartService(welcomePartData);
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        console.log("found", memberSocketId);
        io.to(memberSocketId).emit("WELCOME_PART_ADDED", {
          welcomePart: { ...newWelcomePartData },
        });
      }
    });
    if (userSocketMap[+userId]) {
      const emitTo = userSocketMap[+userId];
      console.log("emitting to user with ownerId", emitTo);
      io.to(emitTo).emit("WELCOME_PART_ADDED", {
        welcomePart: { ...newWelcomePartData },
      });
    }
    return res.status(201).json(newWelcomePartData);
  } catch (error) {
    next(error);
  }
};

export const deleteWelcomePart = async (
  req: Request<{ welcomeId: string }, {}, { surveyId: string }>,
  res: Response<
    {},
    { userId: string; groupId: string; groupMembers?: UserGroupModel[] }
  >,
  next: NextFunction
) => {
  try {
    const { groupMembers, userId } = res.locals;
    const { surveyId } = req.body;
    const { welcomeId } = req.params;
    await deleteWelcomePartService(+welcomeId);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("WELCOME_PART_DELETED", {
          welcomePart: welcomeId,
          surveyId: surveyId,
        });
      }

      if (userSocketMap[+userId]) {
        const emitTo = userSocketMap[+userId];
        io.to(emitTo).emit("WELCOME_PART_DELETED", {
          welcomePart: welcomeId,
          surveyId: surveyId,
        });
      }
    });
    return res.status(200).json(welcomeId);
  } catch (error) {
    next(error);
  }
};

export const duplicateWelcomePart = async (
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
  res: Response<
    {},
    {
      workspaceId: string;
      welcomePart: WelcomePartModel;
    }
  >,
  next: NextFunction
) => {
  try {
    const { welcomePart } = res.locals;
    const newWelcomePartData = await duplicateWelcomePartService(welcomePart);
    return res.status(201).json(newWelcomePartData);
  } catch (error) {
    next(error);
  }
};

export const editWelcomePart = async (
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
  res: Response<
    {},
    {
      workspaceId: string;
      welcomePartData: NewWelcomePart;
      userId: string;
      groupId: string;
      groupMembers: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { welcomePartData, groupMembers, userId } = res.locals;
    const { welcomeId } = req.params;
    const newWelcomePartData = await editWelcomePartService(
      welcomePartData,
      +welcomeId
    );

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("WELCOME_PART_UPDATED", {
          welcomePart: { ...newWelcomePartData!.get({ plain: true }) },
        });
      }
    });

    if (userSocketMap[+userId]) {
      const emitTo = userSocketMap[+userId];
      io.to(emitTo).emit("WELCOME_PART_UPDATED", {
        welcomePart: { ...newWelcomePartData!.get({ plain: true }) },
      });
    }

    return res.status(200).json(newWelcomePartData!);
  } catch (error) {
    next(error);
  }
};
