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
        createdAt: new Date(),
      };
      const duped = await CustomEnding.create(
        newCustomEnding as CustomEndingModel
      );
      return duped.get({ plain: true });
    } else {
      const { id, ...newDefaultEndingData } = ending;
      const newDefaultEnding = {
        ...newDefaultEndingData,
        surveyId: ending.surveyId,
        defaultEnding: false,
        type,
        createdAt: new Date(),
      };
      const duped = await DefaultEnding.create(
        newDefaultEnding as DefaultEndingModel
      );
      return duped.get({ plain: true });
    }
  } catch (error) {
    throw error;
  }
};

export const editEndingService = async (
  ending: DefaultEndingModel | CustomEndingModel,
  endingId: number,
  currentEndingType: "default" | "custom"
) => {
  try {
    if (ending.defaultEnding) {
      await Promise.all([
        CustomEnding.update(
          { defaultEnding: false },
          { where: { defaultEnding: true } }
        ),
        DefaultEnding.update(
          { defaultEnding: false },
          { where: { defaultEnding: true } }
        ),
      ]);
    }

    let endingType;
    let updated = false;

    if (currentEndingType !== ending.type) {
      await Promise.all([
        CustomEnding.destroy({ where: { id: endingId } }),
        DefaultEnding.destroy({ where: { id: endingId } }),
      ]);

      if (ending.type === "custom") {
        endingType = await CustomEnding.create(ending as CustomEndingModel);
      } else {
        endingType = await DefaultEnding.create(ending as DefaultEndingModel);
      }
    } else {
      if (currentEndingType === "custom") {
        await CustomEnding.update(ending as CustomEndingModel, {
          where: { id: endingId },
        });
        endingType = await CustomEnding.findByPk(endingId);
      } else {
        await DefaultEnding.update(ending as DefaultEndingModel, {
          where: { id: endingId },
        });
        endingType = await DefaultEnding.findByPk(endingId);
      }
      updated = true;
    }

    return updated ? endingType : endingType?.get({ plain: true });
  } catch (error) {
    console.error("Error editing ending:", error);
    throw new Error("Failed to edit ending. Please try again.");
  }
};
