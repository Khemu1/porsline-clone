import { io } from "../server";
import {
  addGenericTestService,
  deleteGenricTextService,
  duplicateGenericTextService,
  editGenericTextService,
  getGenericQuestionService,
} from "../services/genericText";
import {
  GenericTextModel,
  NewQuestion,
  NewQuestionOptions,
  UserGroupModel,
} from "../types/types";
import { Request, Response, NextFunction } from "express";
import { userSocketMap } from "../handlers/socketHandler";
export const addGenericQuestion = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<
    {},
    {
      newQuestion: NewQuestion;
      groupId: string;
      userId: string;
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { newQuestion, groupId, userId, groupMembers } = res.locals;
    const newQuestionData = await addGenericTestService(newQuestion);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("GENERIC_TEXT_ADDED", {
          newGenericText: { ...newQuestionData },
        });
      }
    });

    return res.status(201).json(newQuestionData);
  } catch (error) {
    next(error);
  }
};

export const getGenericQuestion = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      newQuestion: NewQuestion;
      groupId: string;
      userId: string;
    }
  >,
  next: NextFunction
) => {
  try {
    const { questionId } = req.params;

    const newQuestionData = await getGenericQuestionService(+questionId);

    return res.status(200).json(newQuestionData || { newQuestionData: null });
  } catch (error) {
    next(error);
  }
};

export const deleteGenericQuestion = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      newQuestion: NewQuestion;
      groupId: string;
      userId: string;
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { questionId } = req.params;
    const { groupMembers } = res.locals;
    const { surveyId } = req.body;

    await deleteGenricTextService(+questionId);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("GENERIC_TEXT_DELETED", {
          surveyId: surveyId,
          questionId: questionId,
        });
      }
    });
    return res.status(200).json({ questionId });
  } catch (error) {
    next(error);
  }
};

export const duplicateGenericText = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      newQuestion: NewQuestion;
      question: GenericTextModel;
      groupId: string;
      userId: string;
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { question, groupMembers } = res.locals;
    const newQuestionData = await duplicateGenericTextService(question);

    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("GENERIC_TEXT_DUPLICATED", {
          duplicatedGenericText: { ...newQuestionData },
        });
      }
    });

    return res.status(201).json({ question: { ...newQuestionData } });
  } catch (error) {
    next(error);
  }
};

export const editGenericText = async (
  req: Request<
    { questionId: string },
    {},
    {
      workspaceId: string;
      surveyId: string;
      newQuestion: NewQuestion;
      options: NewQuestionOptions;
    }
  >,
  res: Response<
    {},
    {
      workspaceId: string;
      newQuestion: NewQuestion;
      groupId: string;
      userId: string;
      groupMembers?: UserGroupModel[];
    }
  >,
  next: NextFunction
) => {
  try {
    const { newQuestion, groupMembers } = res.locals;
    const { questionId } = req.params;
    const newQuestionData = await editGenericTextService(
      newQuestion,
      +questionId
    );
    groupMembers?.forEach((member) => {
      const memberSocketId = userSocketMap[member.userId];
      if (memberSocketId) {
        io.to(memberSocketId).emit("GENERIC_TEXT_EDITED", {
          editedGenericText: { ...newQuestionData },
        });
      }
    });

    return res.status(200).json({ question: { ...newQuestionData } });
  } catch (error) {
    next(error);
  }
};
