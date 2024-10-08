import { object, string, ZodError, instanceof as instanceof_ } from "zod";
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

export const welcomeFormSchema = (
  isLabelEnabled: boolean,
  isDescriptionEnabled: boolean,
  isImageUploadEnabled: boolean
) => {
  return object({
    label: string()
      .max(100, { message: "labelIsTooLong" })
      .optional()
      .refine((val) => !isLabelEnabled || (val && val.length > 0), {
        message: "labelRequired",
      }),

    buttonText: string().max(50, { message: "buttonTextTooLong" }).optional(),

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
  });
};
