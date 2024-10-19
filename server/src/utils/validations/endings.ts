import { object, string, number, boolean, ZodIssueCode } from "zod";
import { DefaultEndingOptions } from "../../types/types";

export const customEndingSchema = (defaultEndingParam: boolean) => {
  return object({
    redirectUrl: string().url(),
    label: string().max(100).optional(),
    defaultEnding: boolean().refine(
      (val) => {
        if (defaultEndingParam === true) {
          return val === true;
        }
        return true;
      },
      {
        message:
          "defaultEnding must be true if the parameter defaultEnding is true.",
      }
    ),
  });
};

export const defaultEndingSchema = (options: DefaultEndingOptions) => {
  return object({
    label: string()
      .min(1, { message: "labelRequired" })
      .max(100, { message: "labelIsTooLong" }),

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

    defaultEnding: boolean()
      .optional()
      .refine((val) => !options.defaultEnding || val, {
        message: "defaultEnding",
      }),
    shareSurvey: boolean()
      .optional()
      .refine((val) => !options.shareSurvey || val, {
        message: "defaultEnding",
      }),
    buttonText: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .refine(
        (val) => !options.reloadOrRedirectButton || (val && val.length > 0),
        {
          message: "buttonTextRequired",
        }
      ),
    redirectToWhat: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .refine(
        (val) => !options.reloadOrRedirectButton || (val && val.length > 0),
        {
          message: "buttonTextRequired",
        }
      ),
    anotherLink: string().url().optional(),
    reloadTimeInSeconds: number()
      .optional()
      .refine((val) => !options.autoReload || (val && val >= 1), {
        message: "invalidRealodTime",
      }),
  }).superRefine((val, ctx) => {
    if (
      options.reloadOrRedirectButton &&
      val.redirectToWhat?.toLowerCase() === "Another Link".toLowerCase() &&
      !val.anotherLink
    ) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "missingAnotherLink",
        path: ["anotherLink"],
      });
    }
  });
};
