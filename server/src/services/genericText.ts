import GeneralRegex from "../db/models/GeneralRegex";
import GeneralText from "../db/models/GeneralText";
import GenericText from "../db/models/GenericText";
import { GenericTextModel, NewQuestion } from "../types/types";
import { copyFileWithNewName } from "../utils";

export const addGenericTestService = async (newQuestion: NewQuestion) => {
  try {
    console.log("in controller");
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
  console.log("in service", question);
  try {
    const { generalText, generalRegex, id, imageUrl, ...otherProps } = question;

    let newImageUrl = imageUrl;
    if (imageUrl) {
      newImageUrl = await copyFileWithNewName(imageUrl);
    }

    const duplicatedGenericText = {
      ...otherProps,
      imageUrl: newImageUrl,
    };

    const newGenericText = (
      await GenericText.create(duplicatedGenericText)
    ).get({ plain: true });

    if (generalText) {
      const { id: textId, ...duplicatedGeneralTextData } = generalText;
      const duplicatedGeneralText = {
        ...duplicatedGeneralTextData,
        questionId: newGenericText.id,
      };
      const dupedText = await GeneralText.create(duplicatedGeneralText);
      newGenericText.generalText = { ...dupedText.get({ plain: true }) };
    }

    if (generalRegex) {
      const { id: regexId, ...duplicatedGeneralRegexData } = generalRegex;
      const duplicatedGeneralRegex = {
        ...duplicatedGeneralRegexData,
        questionId: newGenericText.id,
      };
      const dupedRegex = await GeneralRegex.create(duplicatedGeneralRegex);
      newGenericText.generalRegex = { ...dupedRegex.get({ plain: true }) };
    }

    return newGenericText;
  } catch (error) {
    throw error;
  }
};
