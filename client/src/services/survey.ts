import { CustomError } from "../utils/CustomError";

export const signIn = async (
  formData: SignInProps,
  t: (key: string) => string
): Promise<SignInResponseProps> => {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();
      const errorMessage =
        errorData.statusCode === 404
          ? t("error404")
          : errorData.statusCode === 500
          ? t("error500")
          : errorData.message || "Sign-in failed";

      const err = new CustomError(
        errorMessage,
        response.status,
        "SignInError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    const data: SignInResponseProps = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError(t("error500"), 500);
    }
    console.error(error);
    throw error;
  }
};
