import { translations } from "../components/lang/translations";
import { SignInProps, SignInResponseProps } from "../types";
import { CustomError } from "../utils/CustomError";

export const signIn = async (
  formData: SignInProps,
  currentLang: "de" | "en",
  lang: () => (typeof translations)["en"]
): Promise<SignInResponseProps> => {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        currentLanguageTranslations[
          errorData.type as keyof typeof currentLanguageTranslations
        ] || currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "getSurveyError",
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
      throw new CustomError("error500", 500);
    }
    console.error(error);
    throw error;
  }
};

export const authUser = async (): Promise<SignInResponseProps> => {
  try {
    const response = await fetch("/api/auth/auth-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();
      const err = new CustomError(
        errorData.message || "Sign-in failed",
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
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const signoutUser = async () => {
  try {
    const response = await fetch("/api/auth/auth-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();
      const err = new CustomError(
        errorData.message || "Sign-out failed",
        response.status,
        "SignOutError",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const sendEmail = async (email: string) => {
  try {
    const response = await fetch("/api/auth/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();
      const err = new CustomError(
        errorData.message || "Email Varfication Failed",
        response.status,
        "email varfication ",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const getUserData = async (
  lang: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  try {
    const response = await fetch("/api/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": currentLang,
      },
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();

      const currentLanguageTranslations = lang();

      const errorMessage =
        errorData.message ?? currentLanguageTranslations.unknownError;

      const err = new CustomError(
        errorMessage,
        response.status,
        "getUserData",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return response.json();
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};

export const checkResetToken = async (token: string) => {
  try {
    const response = await fetch("/api/auth/check-reset-password-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    if (!response.ok) {
      const errorData: CustomError = await response.json();
      const err = new CustomError(
        errorData.message || "PassWord Reset Failed",
        response.status,
        "password reset",
        true,
        errorData.details,
        errorData.errors
      );
      throw err;
    }

    return;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
