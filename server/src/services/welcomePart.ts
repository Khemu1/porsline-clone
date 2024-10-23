import GenericText from "../db/models/GenericText";
import WelcomePart from "../db/models/WelcomePart";
import { io } from "../server"; 
import { NewWelcomePart, WelcomePartModel } from "../types/types";
import { copyFileWithNewName } from "../utils";

export const getWelcomePartService = async (
  welcomeId: number
): Promise<WelcomePartModel> => {
  try {
    const welcomePart = await WelcomePart.findByPk(welcomeId);

    return welcomePart!.get();
  } catch (error) {
    throw error;
  }
};

export const addWelcomePartService = async (data: NewWelcomePart) => {
  try {
    const welcomePart = await WelcomePart.create({
      ...(data as WelcomePartModel),
    });
    return welcomePart.get({ plain: true }) as WelcomePartModel;
  } catch (error) {
    throw error;
  }
};

export const deleteWelcomePartService = async (workspaceId: number) => {
  try {
    await WelcomePart.destroy({
      where: {
        id: workspaceId,
      },
    });

  } catch (error) {
    throw error;
  }
};

export const duplicateWelcomePartService = async (
  welcomePart: WelcomePartModel
) => {
  try {
    const { id, ...eWelcomePart } = welcomePart;

    let duped;
    if (eWelcomePart.imageUrl) {
      const newImageUrl = await copyFileWithNewName(eWelcomePart.imageUrl!);
      duped = { ...eWelcomePart, imageUrl: newImageUrl };
    } else {
      duped = eWelcomePart;
    }
    await WelcomePart.create(duped);

    return duped;
  } catch (error) {
    throw error;
  }
};

export const editWelcomePartService = async (
  welcomePart: NewWelcomePart,
  welcomepartId: number
) => {
  try {
    await WelcomePart.update(
      {
        ...(welcomePart as WelcomePartModel),
      },
      {
        where: {
          id: welcomepartId,
        },
      }
    );

    const updatedWelcomePart = await WelcomePart.findByPk(welcomepartId);
    return updatedWelcomePart;
  } catch (error) {
    throw error;
  }
};
