import fs from "fs";
import path from "path";
import { CustomError } from "../../errors/customError";
import { NewWelcomePart, welcomePartOptions } from "../../types/types";

export const makeImage = (image: string) => {
  const imageType = image.match(/data:image\/(\w+);base64,/)![1];
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const __dirname = process.cwd();
  console.log(__dirname);

  const filePath = path.join(
    __dirname,
    "uploads",
    `${Date.now()}.${imageType}`
  );

  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.log(err);
      throw new CustomError("Error saving image", 400, true);
    }
    return filePath;
  });
  return filePath;
};

export const processWelcomePartData = (data: any): NewWelcomePart => {
  return {
    surveyId: +data.surveyId,
    label: data.label ? data.label : undefined,
    imageUrl: data.imageUrl ? data.imageUrl : undefined,
    description: data.description ? data.description : undefined,
    buttonText: data.buttonText ? data.buttonText : undefined,
  };
};
export const processWelcomePartOptions = (data: any): welcomePartOptions => {
  return {
    isLabelEnabled: data.isLabelEnabled === "true",
    isDescriptionEnabled: data.isDescriptionEnabled === "true",
    isImageUploadEnabled: data.isImageUploadEnabled === "true",
  };
};
