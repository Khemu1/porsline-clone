import WelcomePart from "../db/models/WelcomePart";
import { NewWelcomePart, WelcomePartModel } from "../types/types";

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
      ...data,
    });
    return welcomePart.get() as WelcomePartModel;
  } catch (error) {
    throw error;
  }
};
