import { useDispatch } from "react-redux";
import { WelcomePartModel } from "../types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CustomError } from "../utils/CustomError";
import { translations } from "../components/lang/translations";
import { addWelcomePartF } from "../utils";
import { addWelcomePart } from "../services/welcomePart";

export const useAddWelcomePart = () => {
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    WelcomePartModel,
    CustomError | unknown,
    {
      welcomePart: FormData;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      welcomePart,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      const response = await addWelcomePart(
        welcomePart,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: async (newWelcomePart: WelcomePartModel) => {
      await addWelcomePartF(newWelcomePart, dispatch);
      console.log("Survey created successfully:", newWelcomePart);
    },
    onError: (err: CustomError | unknown) => {
      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error creating new survey:", err);
    },
  });

  const {
    mutateAsync: handleAddWelcomePart,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddWelcomePart,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
