import fs from "fs";
import path from "path";
import { CustomError } from "../errors/customError";
import {
  DefaultEndingOptions,
  NewCustomEnding,
  NewDefaultEnding,
  NewQuestion,
  NewQuestionOptions,
  NewWelcomePart,
  welcomePartOptions,
} from "../types/types";

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

export const processQuestionData = (data: any): NewQuestion => {
  const getFirstValue = (value: any) =>
    Array.isArray(value) ? value[0] : value;

  return {
    type: data.type,
    surveyId: Number(data.surveyId),
    label: data.label,
    description: data.description ?? undefined,
    imageUrl: data.imageUrl ?? undefined,
    minLength: data.minLength ? Number(data.minLength) : undefined,
    maxLength: data.maxLength ? Number(data.maxLength) : undefined,
    isRequired: getFirstValue(data.isRequired) === "true",
    regex: data.regex ?? undefined,
    regexPlaceHolder: data.regexPlaceHolder ?? undefined,
    regexErrorMessage: data.regexErrorMessage ?? undefined,
    hideQuestionNumber: getFirstValue(data.hideQuestionNumber) === "true",
  };
};
export const processNewQuestionOptions = (data: any): NewQuestionOptions => {
  const getFirstValue = (value: any) =>
    Array.isArray(value) ? value[0] : value;

  return {
    isDescriptionEnabled: getFirstValue(data.isDescriptionEnabled) === "true",
    isImageUploadEnabled: getFirstValue(data.isImageUploadEnabled) === "true",
    isFormatText: getFirstValue(data.isFormatText) === "true",
    isFormatRegex: getFirstValue(data.isFormatRegex) === "true",
    hasPlaceHolder: getFirstValue(data.hasPlaceHolder) === "true",
    hasRegexErrorMessage: getFirstValue(data.hasRegexErrorMessage) === "true",
    hideQuestionNumber: getFirstValue(data.hideQuestionNumber) === "true",
    isRequired: getFirstValue(data.isRequired) === "true",
  };
};

export const processDefaultEndingData = (data: any): NewDefaultEnding => {
  const getFirstValue = (value: any) =>
    Array.isArray(value) ? value[0] : value;

  return {
    surveyId: +data.surveyId,
    label: data.label,
    imageUrl: data.imageUrl ?? undefined,
    description: data.description ?? undefined,
    type: data.type,
    shareSurvey: getFirstValue(data.shareSurvey) === "true",
    defaultEnding: getFirstValue(data.defaultEnding) === "true",
    reloadOrRedirect: getFirstValue(data.reloadOrRedirectButton) === "true",
    buttonText: data.buttonText ?? undefined,
    redirectToWhat: data.redirectToWhat ?? undefined,
    anotherLink: data.anotherLink ?? undefined,
    autoReload: getFirstValue(data.autoReload) === "true",
    reloadTimeInSeconds: data.reloadTimeInSeconds
      ? Number(data.reloadTimeInSeconds)
      : undefined,
  };
};

export const processDefaultEndingOptions = (
  data: any
): DefaultEndingOptions => {
  return {
    isDescriptionEnabled: data.isDescriptionEnabled === "true",
    isImageUploadEnabled: data.isImageUploadEnabled === "true",
    shareSurvey: data.shareSurvey === "true",
    defaultEnding: data.defaultEnding === "true",
    reloadOrRedirectButton: data.reloadOrRedirectButton === "true",
    autoReload: data.autoReload === "true",
  };
};

export const processCustomEndingData = (data: any): NewCustomEnding => {
  const getFirstValue = (value: any) =>
    Array.isArray(value) ? value[0] : value;

  return {
    surveyId: +data.surveyId,
    redirectUrl: data.redirectUrl,
    type: data.type,
    label: data.label ?? undefined,
    defaultEnding: getFirstValue(data.defaultEnding) === "true",
  };
};

export const copyFileWithNewName = async (srcPath: string) => {
  try {
    const dir = path.dirname(srcPath);
    const ext = path.extname(srcPath);

    const uniqueName = `${Date.now()}${ext}`;

    const destPath = path.join(dir, uniqueName);

    fs.copyFileSync(srcPath, destPath);

    console.log(`File copied successfully as ${uniqueName}`);
    return destPath;
  } catch (err) {
    throw err;
  }
};
