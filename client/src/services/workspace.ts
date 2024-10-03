import { WorkSpaceModel } from "../types";
import { CustomError } from "../utils/CustomError";

export const getWorkspaces = async (): Promise<WorkSpaceModel[]> => {
  try {
    const response = await fetch("/api/workspace/get-workspaces", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

    const data: WorkSpaceModel[] = await response.json();
    return data;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Network error", 500);
    }
    throw error;
  }
};
