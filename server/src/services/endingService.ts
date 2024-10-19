import DefaultEnding from "../db/models/DefaultEnding";
import {
  CustomEndingModel,
  DefaultEndingModel,
  NewCustomEnding,
  NewDefaultEnding,
} from "../types/types";
import CustomEnding from "../db/models/CustomEnding";

export const addEndingService = async (
  endingData: NewDefaultEnding | NewCustomEnding,
  type: "custom" | "default"
) => {
  console.log("in service");
  try {
    if (endingData.defaultEnding) {
      await CustomEnding.update(
        { defaultEnding: false },
        {
          where: {
            defaultEnding: true,
          },
        }
      );
      await DefaultEnding.update(
        { defaultEnding: false },
        {
          where: {
            defaultEnding: true,
          },
        }
      );
    }
    if (type === "custom") {
      const customEnding = await CustomEnding.create(
        endingData as NewCustomEnding
      );
      return {
        ending: customEnding,
        type,
        default: endingData.defaultEnding ?? false,
      };
    } else {
      const defaultEnding = await DefaultEnding.create(
        endingData as NewDefaultEnding
      );
      return {
        ending: defaultEnding,
        type,
        default: endingData.defaultEnding ?? false,
      };
    }
  } catch (error) {
    console.error(`Failed to add ${type} ending:`, error);
    throw error;
  }
};

export const deleteEndingService = async (endingId: number, type: string) => {
  try {
    if (type === "default") {
      await DefaultEnding.destroy({
        where: {
          id: endingId,
        },
      });
    } else if (type === "custom") {
      await CustomEnding.destroy({
        where: {
          id: endingId,
        },
      });
    }
    return endingId;
  } catch (error) {
    throw error;
  }
};

export const duplicateEndingService = async (
  ending: CustomEndingModel | DefaultEndingModel,
  type: "custom" | "default"
) => {
  try {
    if (type === "custom") {
      const { id, ...newCustomEndingData } = ending;
      const newCustomEnding = {
        ...newCustomEndingData,
        surveyId: ending.surveyId,
        defaultEnding: false,
        type,
      };
      await CustomEnding.create(newCustomEnding as CustomEndingModel);
      return newCustomEnding;
    } else {
      const { id, ...newDefaultEndingData } = ending;
      const newDefaultEnding = {
        ...newDefaultEndingData,
        surveyId: ending.surveyId,
        defaultEnding: false,
        type,
      };
      const duped = await DefaultEnding.create(
        newDefaultEnding as DefaultEndingModel
      );
      return duped;
    }
  } catch (error) {
    throw error;
  }
};
