import CustomEnding from "../db/models/CustomEnding";
import DefaultEnding from "../db/models/DefaultEnding";
import GeneralRegex from "../db/models/GeneralRegex";
import GeneralText from "../db/models/GeneralText";
import GenericText from "../db/models/GenericText";
import Survey from "../db/models/Survey";
import WelcomePart from "../db/models/WelcomePart";
import { CustomError } from "../errors/customError";

import { Op } from "sequelize";

export const getSurveyPreviewService = async (surveyId: number) => {
  console.log("getting preview", surveyId);

  try {
    const survey = await Survey.findOne({
      include: [
        {
          model: WelcomePart,
          as: "welcomePart",
        },
        {
          model: DefaultEnding,
          as: "defaultEndings",
        },
        {
          model: CustomEnding,
          as: "customEndings",
        },
        {
          model: GenericText,
          as: "questions",
          include: [
            { model: GeneralRegex, as: "generalRegex" },
            { model: GeneralText, as: "generalText" },
          ],
        },
      ],
      where: {
        id: surveyId,
      },
      order: [["questions", "createdAt", "ASC"]],
    });

    if (!survey) {
      throw new CustomError("Survey not found", 404, true);
    }

    const plainSurvey = survey.get({ plain: true });

    const defaultEnding = plainSurvey.defaultEndings?.find(
      (ending) => ending.defaultEnding
    );
    const customEnding = plainSurvey.customEndings?.find(
      (ending) => ending.defaultEnding
    );

    const finalSurvey = {
      welcomePart: plainSurvey.welcomePart,
      ending: defaultEnding || customEnding || null,
      questions: plainSurvey.questions,
    };

    return finalSurvey;
  } catch (error) {
    throw error;
  }
};
