import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CustomError } from "../utils/CustomError";
import { translations } from "../components/lang/translations";
import { addUserToGroup, removeUserFromGroup } from "../services/userGroup";
import { UserGroupModel } from "../types";
import { addGroupMemberF, removeGroupMemberF } from "../utils";
import { useDispatch } from "react-redux";

export const useAddGroupMember = () => {
  const dispatch = useDispatch();
  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    UserGroupModel, // Correcting the type here to be just UserGroupModel
    CustomError | unknown,
    {
      username: string;
      groupId: number;
      groupName: string;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      username,
      groupId,
      groupName,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await addUserToGroup(
        groupId,
        groupName,
        username,
        getCurrentLanguageTranslations,
        currentLang
      );

      return response;
    },
    onSuccess: async (groupMember: UserGroupModel) => {
      console.log("just arrived", groupMember);
      await addGroupMemberF(groupMember, dispatch);
    },
    onError: (err: CustomError | unknown) => {
      console.log(err);

      const message =
        err instanceof CustomError
          ? err.errors || { message: err.message }
          : { message: "Unknown Error" };
      setErrorState(message);
      console.error("Error adding group member:", err);
    },
  });

  const {
    mutateAsync: handleAddMember,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleAddMember,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};

export const useRemoveGroupMember = () => {
  const dispatch = useDispatch();

  const [errorState, setErrorState] = useState<Record<
    string,
    string | undefined
  > | null>(null);

  const mutation = useMutation<
    number,
    CustomError | unknown,
    {
      memberId: number;
      groupId: number;
      getCurrentLanguageTranslations: () => (typeof translations)["en"];
      currentLang: "en" | "de";
    }
  >({
    mutationFn: async ({
      memberId,
      groupId,
      getCurrentLanguageTranslations,
      currentLang,
    }) => {
      setErrorState(null);

      const response = await removeUserFromGroup(
        groupId,
        memberId,
        getCurrentLanguageTranslations,
        currentLang
      );
      return response;
    },
    onSuccess: (userId: number) => {
      console.log("just arrived", userId);
      removeGroupMemberF(+userId, dispatch);
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
    mutateAsync: handleRemoveMember,
    isError,
    isSuccess,
    isPending,
  } = mutation;

  return {
    handleRemoveMember,
    isError,
    isSuccess,
    errorState,
    isPending,
  };
};
