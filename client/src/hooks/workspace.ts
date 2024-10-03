import { useCallback, useState } from "react";
import { WorkSpaceModel } from "../types";
import { getWorkspaces } from "../services/workspace";
import { CustomError } from "../utils/CustomError";

export const useGetWorkspaces = () => {
  const [data, setData] = useState<[] | WorkSpaceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleGetWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      setData(await getWorkspaces());
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        if (err.errors) {
          setError(err.errors);
        } else {
          setError({
            message: err.message,
          });
        }
      } else {
        setError({
          message: "An unknown error occurred.",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);
  return { handleGetWorkspaces, data, loading, error, success };
};
