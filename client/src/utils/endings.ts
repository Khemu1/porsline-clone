import { object, string, number, boolean, ZodIssueCode } from "zod";

export const customEndingSchema = (defaultEnding: boolean,) => {
  return object({
    redirectUrl: string().url(),
    label: string().max(100).optional(),
    defaultEnding: boolean()
      .optional()
      .refine((val) => !defaultEnding || val, {
        message: "defaultEnding",
      }),
  });
};

export const fileSchema = () => {
  return object({
    type: string().refine((val) => val.startsWith("image/"), {
      message: "invalidImageType",
    }),
  });
};

export const defaultEndingSchema = (
  isDescriptionEnabled: boolean,
  isImageUploadEnabled: boolean,
  shareSurvey: boolean,
  defaultEnding: boolean,
  reloadOrRedirectButton: boolean,
  autoReload: boolean
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

    imageUrl: string()
      .optional()
      .refine(
        (val) =>
          !isImageUploadEnabled ||
          (val && val.match(/^data:image\/(jpeg|png|gif|bmp|webp);base64,/)),
        {
          message: "InvalidImageFormat",
        }
      ),

    defaultEnding: boolean()
      .optional()
      .refine((val) => !defaultEnding || val, {
        message: "defaultEnding",
      }),
    shareSurvey: boolean()
      .optional()
      .refine((val) => !shareSurvey || val, {
        message: "defaultEnding",
      }),
    buttonText: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .refine((val) => !reloadOrRedirectButton || (val && val.length > 0), {
        message: "buttonTextRequired",
      }),
    redirectToWhat: string()
      .max(50, { message: "buttonTextTooLong" })
      .optional()
      .refine((val) => !reloadOrRedirectButton || (val && val.length > 0), {
        message: "buttonTextRequired",
      }),
    anotherLink: string().url().optional(),
    reloadTimeInSeconds: number()
      .optional()
      .refine((val) => !autoReload || (val && val >= 1), {
        message: "invalidRealodTime",
      }),
  }).superRefine((val, ctx) => {
    if (
      reloadOrRedirectButton &&
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
