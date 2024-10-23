import GeneralRegex from "../db/models/GeneralRegex";
import GeneralText from "../db/models/GeneralText";
import GenericText from "../db/models/GenericText";
import { GenericTextModel, NewQuestion } from "../types/types";
import { copyFileWithNewName } from "../utils";

export const addGenericTestService = async (newQuestion: NewQuestion) => {
  try {
    const { type } = newQuestion;
    const generic = {
      surveyId: newQuestion.surveyId,
      label: newQuestion.label,
      description: newQuestion.description,
      answerFormat: type,
      imageUrl: newQuestion.imageUrl,
      required: newQuestion.isRequired,
      hideQuestionNumber: newQuestion.hideQuestionNumber,
    };
    const genericText = await GenericText.create(generic);

    let question;
    if (type === "text" && (newQuestion.minLength || newQuestion.maxLength)) {
      const generalText = {
        questionId: genericText.id,
        min: newQuestion.minLength!,
        max: newQuestion.maxLength!,
      };
      question = await GeneralText.create(generalText);
    } else if (type === "regex" && newQuestion.regex) {
      const generalRegex = {
        questionId: genericText.id,
        regex: newQuestion.regex,
        regexErrorMessage: newQuestion.regexErrorMessage!,
        regexPlaceHolder: newQuestion.regexPlaceHolder!,
      };
      question = await GeneralRegex.create(generalRegex);
    }

    const fullQuestion = {
      ...genericText.get(),
      question: question ? question.get() : null,
    };
    return fullQuestion;
  } catch (error) {
    throw error;
  }
};

export const getGenericQuestionService = async (
  questionId: number
): Promise<GenericTextModel | null> => {
  try {
    const genericText = await GenericText.findByPk(questionId, {
      include: [
        { model: GeneralText, as: "generalText" },
        { model: GeneralRegex, as: "generalRegex" },
      ],
    });

    if (!genericText) {
      return null;
    }

    let maQuestion: GenericTextModel = genericText.get();
    maQuestion = {
      ...genericText!.get(),
      generalText: { ...(maQuestion.generalText ?? undefined) },
      genericText: { ...(maQuestion.generalRegex ?? undefined) },
    } as GenericTextModel;
    return maQuestion;
  } catch (error) {
    throw error;
  }
};

export const deleteGenricTextService = async (questionId: number) => {
  try {
    await GenericText.destroy({
      where: {
        id: questionId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const duplicateGenericTextService = async (
  question: GenericTextModel
) => {
  try {
    const { generalText, generalRegex, id, imageUrl, ...otherProps } = question;

    let newImageUrl = imageUrl;
    if (imageUrl) {
      newImageUrl = await copyFileWithNewName(imageUrl);
    }

    const duplicatedGenericText = {
      ...otherProps,
      imageUrl: newImageUrl,
      createdAt: new Date(),
    };

    const newGenericText = (
      await GenericText.create(duplicatedGenericText)
    ).get({ plain: true });

    if (generalText) {
      const { id: textId, ...duplicatedGeneralTextData } = generalText;
      const duplicatedGeneralText = {
        ...duplicatedGeneralTextData,
        questionId: newGenericText.id,
        createdAt: new Date(),
      };
      const dupedText = await GeneralText.create(duplicatedGeneralText);
      newGenericText.generalText = { ...dupedText.get({ plain: true }) };
    }

    if (generalRegex) {
      const { id: regexId, ...duplicatedGeneralRegexData } = generalRegex;
      const duplicatedGeneralRegex = {
        ...duplicatedGeneralRegexData,
        questionId: newGenericText.id,
        createdAt: new Date(),
      };
      const dupedRegex = await GeneralRegex.create(duplicatedGeneralRegex);
      newGenericText.generalRegex = { ...dupedRegex.get({ plain: true }) };
    }

    return newGenericText;
  } catch (error) {
    throw error;
  }
};

export const editGenericTextService = async (
  newQuestion: NewQuestion,
  genericTextId: number
) => {
  try {
    const {
      type,
      minLength,
      maxLength,
      regex,
      regexErrorMessage,
      regexPlaceHolder,
    } = newQuestion;

    const generic = {
      surveyId: newQuestion.surveyId,
      label: newQuestion.label,
      description: newQuestion.description || undefined,
      answerFormat: type,
      imageUrl: newQuestion.imageUrl || undefined,
      required: newQuestion.isRequired,
      hideQuestionNumber: newQuestion.hideQuestionNumber,
    };

    await GenericText.update(generic, {
      where: { id: genericTextId },
    });

    await GeneralRegex.destroy({
      where: { questionId: genericTextId },
    });

    if (
      type === "text" &&
      (minLength !== undefined || maxLength !== undefined)
    ) {
      const generalText = {
        questionId: genericTextId,
        min: minLength!,
        max: maxLength!,
      };
      await GeneralText.create({ ...generalText });
    } else if (type === "regex" && regex) {
      const generalRegex = {
        questionId: genericTextId,
        regex,
        regexErrorMessage: regexErrorMessage!,
        regexPlaceHolder: regexPlaceHolder || undefined,
      };
      await GeneralRegex.create({ ...generalRegex });

      await GeneralText.destroy({
        where: { questionId: genericTextId },
      });
    }

    const question = await GenericText.findByPk(genericTextId, {
      include: [
        {
          model: GeneralText,
          as: "generalText",
        },
        {
          model: GeneralRegex,
          as: "generalRegex",
        },
      ],
    });

    const plainGenericText = question!.get({ plain: true });

    const fullQuestion = {
      ...plainGenericText,
      generalText: plainGenericText.generalText || undefined,
      generalRegex: plainGenericText.generalRegex || undefined,
    };
    return fullQuestion;
  } catch (error) {
    throw error;
  }
};
