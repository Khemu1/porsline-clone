import { NextFunction, Request, Response } from "express";
import { SurveyModel, UserGroupModel } from "../types/types";
import {
  addSurveyService,
  deleteSurveyService,
  duplicateSurveyService,
  getSurveyService,
  moveSurveyService,
  updateSurveyStatusService,
  updateSurveyTitleService,
  updateSurveyUrlService,
} from "../services/surveyService";
import { userSocketMap } from "../handlers/socketHandler";
import { io } from "../server";

export const addSurvey = async (
  req: Request<
    { workspaceId: string },
    {},
    { title: string; workspaceId: string }
  >,
  res: Response<{}, { userId: string; groupMembers?: UserGroupModel[] }>,
  next: NextFunction
) => {
  try {
    const { title, workspaceId } = req.body;
    const { groupMembers } = res.locals;
    const surveyData = await addSurveyService(+workspaceId, title);
    console.log("groupMembers", groupMembers);
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("SURVEY_ADDED", {
          survey: { ...surveyData },
        });
      }
    });
    res.status(201).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const getSurvey = async (
  req: Request<{ surveyId: string; workspaceId: string }, {}, {}>,
  res: Response<{}, { userId: string }>,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const surveyData = await getSurveyService(+surveyId);
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurveyTitle = async (
  req: Request<
    { surveyId: string },
    {},
    { title: string; workspaceId: string }
  >,
  res: Response<
    {},
    { userId: string; workspaceId: string; groupMembers?: UserGroupModel[] }
  >,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { title, workspaceId } = req.body;
    const { groupMembers, userId } = res.locals;
    const surveyData = await updateSurveyTitleService(+surveyId, title);
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("SURVEY_EDITED", {
          survey: { ...surveyData, workspace: +workspaceId },
          surveyWorkspaceId: +workspaceId,
        });
      }
    });
    if (userSocketMap[+userId]) {
      const emitTo = userSocketMap[+userId];
      io.to(emitTo).emit("SURVEY_EDITED", {
        survey: { ...surveyData, workspace: +workspaceId },
        surveyWorkspaceId: +workspaceId,
      });
    }
    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurvyStatus = async (
  req: Request<
    { surveyId: string },
    { isActive: boolean; title: string; workspaceId: string }
  >,
  res: Response<
    {},
    { workspaceId: string; groupMembers?: UserGroupModel[]; userId: string }
  >,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { workspaceId } = req.body;
    const { groupMembers, userId } = res.locals;
    const surveyData = await updateSurveyStatusService(+surveyId);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("SURVEY_EDITED", {
          survey: { ...surveyData, workspace: workspaceId },
          surveyWorkspaceId: workspaceId,
        });
      }
    });
    if (userSocketMap[+userId]) {
      const emitTo = userSocketMap[+userId];
      io.to(emitTo).emit("SURVEY_EDITED", {
        survey: { ...surveyData, workspace: workspaceId },
        surveyWorkspaceId: workspaceId,
      });
    }

    return res.status(200).json(surveyData);
  } catch (error) {
    next(error);
  }
};

export const updateSurveyUrl = async (
  req: Request<
    { surveyId: string },
    { url: string; isActive: boolean; title: string; workspaceId: string }
  >,
  res: Response<
    {},
    { workspaceId: string; groupMembers?: UserGroupModel[]; userId: string }
  >,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { url, workspaceId } = req.body;
    const { groupMembers, userId } = res.locals;
    const surveyData = await updateSurveyUrlService(+surveyId, url);
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("SURVEY_EDITED", {
          survey: { ...surveyData, workspace: +workspaceId },
          surveyWorkspaceId: +workspaceId,
        });
      }
    });
    console.log("users with owner id", userSocketMap[+userId]);
    if (userSocketMap[+userId]) {
      const emitTo = userSocketMap[+userId];
      io.to(emitTo).emit("SURVEY_EDITED", {
        survey: { ...surveyData, workspace: +workspaceId },
        surveyWorkspaceId: +workspaceId,
      });
    }
    return res.status(200).json({ ...surveyData, workspace: +workspaceId });
  } catch (error) {
    next(error);
  }
};

export const deleteSurvey = async (
  req: Request<{ surveyId: string }, {}>,
  res: Response<
    {},
    { userId: string; groupMembers?: UserGroupModel[]; workspaceId: string }
  >,
  next: NextFunction
) => {
  try {
    const { surveyId } = req.params;
    const { groupMembers, userId } = res.locals;
    const { workspaceId } = req.body;
    await deleteSurveyService(+surveyId);
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("SURVEY_DELETED", {
          surveyId: surveyId,
          surveyWorkspaceId: workspaceId,
        });
      }
    });
    if (userSocketMap[+userId]) {
      const emitTo = userSocketMap[+userId];
      io.to(emitTo).emit("SURVEY_DELETED", {
        surveyId: surveyId,
        surveyWorkspaceId: workspaceId,
      });
    }
    return res.status(200).json("deleted");
  } catch (error) {
    next(error);
  }
};

export const duplicateSurvey = async (
  req: Request<
    { surveyId: string },
    {},
    { workspaceId: string; targetWorkspaceId: string }
  >,
  res: Response<
    {},
    {
      duplicateSurvey?: SurveyModel;
      groupMembers?: UserGroupModel[];
      userId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const { targetWorkspaceId } = req.body;
    const { groupMembers, userId, duplicateSurvey } = res.locals;
    const survey = await duplicateSurveyService(
      +targetWorkspaceId,
      duplicateSurvey!
    );
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("SURVEY_DUPLICATED", {
          survey: { ...survey },
        });
      }
    });
    return res.status(201).json(survey);
  } catch (error) {
    next(error);
  }
};

export const moveSurvey = async (
  req: Request<
    { surveyId: string },
    {},
    { targetWorkspaceId: string; workspaceId: string }
  >,
  res: Response<{}, { groupMembers?: UserGroupModel[]; userId: string }>,
  next: NextFunction
) => {
  try {
    const { targetWorkspaceId, workspaceId } = req.body;
    const { surveyId } = req.params;
    const { groupMembers, userId } = res.locals;
    await moveSurveyService(+targetWorkspaceId, +surveyId);
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("SURVEY_MOVED", {
          surveyId: +surveyId,
          sourceWorkspaceId: +workspaceId,
          targetWorkspaceId: +targetWorkspaceId,
        });
      }
    });

    if (userSocketMap[+userId]) {
      const emitTo = userSocketMap[+userId];
      io.to(emitTo).emit("SURVEY_MOVED", {
        surveyId: +surveyId,
        sourceWorkspaceId: +workspaceId,
        targetWorkspaceId: +targetWorkspaceId,
      });
    }

    return res.status(200).json({ targetWorkspaceId });
  } catch (error) {
    next(error);
  }
};
