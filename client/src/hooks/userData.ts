import { useState } from "react";
import { translations } from "../components/lang/translations";
import { UserModel } from "../types";
import { CustomError } from "../utils/CustomError";
import { getUserData } from "../services/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetUserData = (
  getCurrentLanguageTranslations: () => (typeof translations)["en"],
  currentLang: "en" | "de"
) => {
  const [errorState, setErrorState] = useState<Record<string, string> | null>(
    null
  );

  const {
    data: user,
    isError,
    isLoading,
  } = useQuery<UserModel, CustomError>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const survey = await getUserData(
          getCurrentLanguageTranslations,
          currentLang
        );
        return survey;
      } catch (error) {
        const message =
          error instanceof CustomError
            ? error.errors || { message: error.message }
            : { message: "Unknown Error" };
        setErrorState(message);
        throw error;
      }
    },
  });

  return { user, isError, isLoading, errorState };
};
