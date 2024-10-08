import {
  object,
  string,
  ZodError,
  instanceof as instanceof_,
  number,
  boolean,
  ZodIssueCode,
} from "zod";
import { translations } from "../components/lang/translations";

type Translations = typeof translations;

export type TranslationKeys = keyof Translations["en"];

export const validateWithSchema = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  language: keyof typeof translations
) => {
  if (error instanceof ZodError) {
    const errors = error.errors.reduce((acc: Record<string, string>, curr) => {
      const errorKey = curr.message as TranslationKeys;

      const translation = translations[language][errorKey] || "Unknown error";

      acc[curr.path.join(".")] = translation;
      return acc;
    }, {});
    return errors;
  }

  return {
    message: translations[language]?.unknownError || "Unexpected error",
  };
};

export const genericTextSchema = (
  isFormatText: boolean,
  isFormatRegex: boolean,
  hasPlaceHolder: boolean,
  hasRegexErrorMessage: boolean,
  hideQuestionNumber: boolean,
  isDescriptionEnabled: boolean,
  isImageUploadEnabled: boolean,
  isRequired: boolean
) => {
  return object({
    label: string()
      .min(1, { message: "labelRequired" })
      .max(100, { message: "labelIsTooLong" }),

    description: string()
      .max(300, { message: "descriptionTooLong" })
      .optional()
      .refine((val) => !isDescriptionEnabled || (val && val.length > 0), {
        message: "descriptionRequired",
      }),

    imageFile: instanceof_(File)
      .nullable()
      .optional()
      .refine((val) => !isImageUploadEnabled || val, {
        message: "invalidImage",
      }),

    minLength: number()
      .optional()
      .refine((val) => !isFormatText || (val !== undefined && val >= 0), {
        message: "minRequired",
      }),

    maxLength: number()
      .optional()
      .refine((val) => !isFormatText || (val !== undefined && val > 0), {
        message: "maxRequired",
      }),

    isRequired: boolean()
      .optional()
      .refine((val) => !isRequired || val, {
        message: "isRequired",
      }),

    regex: string()
      .optional()
      .refine((val) => !isFormatRegex || (val && val.length > 0), {
        message: "regexAnswerFormat",
      }),

    regexPlaceHolder: string()
      .optional()
      .refine((val) => !hasPlaceHolder || (val && val.length >= 0), {
        message: "hasPlaceHolder",
      }),

    regexErrorMessage: string()
      .optional()
      .refine(
        (val) =>
          !isFormatRegex || !hasRegexErrorMessage || (val && val.length > 0),
        {
          message: "regexErrorMessageRequired",
        }
      ),

    hideQuestionNumber: boolean()
      .optional()
      .refine((val) => !hideQuestionNumber || val, {
        message: "hideQuestionNumber",
      }),
  }).superRefine((val, ctx) => {
    if (val.minLength === undefined || val.maxLength === undefined) {
      return;
    }

    if (val.minLength > val.maxLength) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "minGreaterThanMax",
        path: ["minLength"],
      });
    }
    if (val.maxLength < val.minLength) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "MaxLesserThanMin",
        path: ["maxLength"],
      });
    }
  });
};
