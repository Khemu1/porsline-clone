import { object, string, ZodError } from "zod";

export const validateWithSchema = <T>(error: any) => {
  if (error instanceof ZodError) {
    const errors = error.errors.reduce((acc: Record<string, string>, curr) => {
      acc[curr.path.join(".")] = curr.message;
      return acc;
    }, {});
    return errors; // Return the errors object
  }

  return null; // Return null if the error is not a ZodError
};

export const newWorkSpcaeSchema = () => {
  return object({
    title: string()
      .min(1, "workspace title is required")
      .max(100, "workspace title is too long"),
  });
};
