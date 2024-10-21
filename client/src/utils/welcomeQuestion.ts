import { object, string, ZodError } from "zod";
import { translations } from "../components/lang/translations";
import { welcomePartOptions } from "../types";

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

export const welcomeFormSchema = (options: welcomePartOptions) => {
  return object({
    label: string()
      .max(100, { message: "labelIsTooLong" })
      .optional()
      .refine((val) => !options.isLabelEnabled || (val && val.length > 0), {
        message: "labelRequired",
      }),

    buttonText: string().max(50, { message: "buttonTextTooLong" }).optional(),

    description: string()
      .max(300, { message: "descriptionTooLong" })
      .optional()
      .refine(
        (val) => !options.isDescriptionEnabled || (val && val.length > 0),
        {
          message: "descriptionRequired",
        }
      ),

    imageUrl: string()
      .optional()
      .refine(
        (val) => {
          if (!options.isImageUploadEnabled) {
            return true;
          }
          return (
            val &&
            val.match(
              /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/
            )
          );
        },
        {
          message: "InvalidImageFormat",
        }
      ),
  });
};

export const updateWelcomeFormSchema = (options: welcomePartOptions) => {
  return object({
    label: string()
      .max(100, { message: "labelIsTooLong" })
      .optional()
      .nullable()
      .refine((val) => !options.isLabelEnabled || (val && val.length > 0), {
        message: "labelRequired",
      }),

    buttonText: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .nullable(),
    description: string()
      .max(300, { message: "descriptionTooLong" })
      .optional()
      .nullable()
      .refine(
        (val) => !options.isDescriptionEnabled || (val && val.length > 0),
        {
          message: "descriptionRequired",
        }
      ),

    imageUrl: string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!options.isImageUploadEnabled || val === null || val === undefined) {
            return true;
          }

          const isValidBase64 = val.match(
            /^data:image\/(jpeg|png|gif|bmp|webp);base64,[A-Za-z0-9+/=]+$/
          );
          const isValidExternalImage = val.includes("\\uploads\\");

          return isValidBase64 || isValidExternalImage;
        },
        {
          message: "InvalidImageFormat",
        }
      ),
  });
};
