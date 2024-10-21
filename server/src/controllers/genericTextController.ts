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
} from "../types/types";
import { Request, Response, NextFunction } from "express";
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
  res: Response<{}, { newQuestion: NewQuestion }>,
  next: NextFunction
) => {
  try {
    const { newQuestion } = res.locals;
    const newQuestionData = await addGenericTestService(newQuestion);
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
  res: Response<{}, { workspaceId: string; newQuestion: NewQuestion }>,
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
  res: Response<{}, { workspaceId: string; newQuestion: NewQuestion }>,
  next: NextFunction
) => {
  try {
    const { questionId } = req.params;
    await deleteGenricTextService(+questionId);
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
    }
  >,
  next: NextFunction
) => {
  try {
    const { question } = res.locals;
    const newQuestionData = await duplicateGenericTextService(question);
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
    }
  >,
  next: NextFunction
) => {
  try {
    const { newQuestion } = res.locals;
    const { questionId } = req.params;
    const newQuestionData = await editGenericTextService(
      newQuestion,
      +questionId
    );
    console.log(newQuestionData);
    return res.status(200).json({ question: { ...newQuestionData } });
  } catch (error) {
    next(error);
  }
};
