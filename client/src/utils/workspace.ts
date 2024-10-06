import { object, string, ZodError } from "zod";
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


export const newWorkspaceSchema = () => {
  return object({
    title: string()
      .min(1, "workspaceTitleRequired")
      .max(100, "workspaceTitleTooLong"),
  });
};
